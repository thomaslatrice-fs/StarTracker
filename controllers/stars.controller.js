const { Star, Galaxy, Planet } = require("../models");

const ALLOWED = ["name", "size", "description", "galaxyId", "image"];

function notFound(req, res) {
  if (req.wantsJson()) return res.status(404).json({ error: "Star not found" });
  return res.status(404).render("errors/error", { message: "Star not found" });
}

exports.index = async (req, res) => {
  const stars = await Star.findAll({ include: Galaxy });
  res.respond(200, { html: "stars/index", json: stars, locals: { stars } });
};

exports.show = async (req, res) => {
  const star = await Star.findByPk(req.params.id, {
    include: [Galaxy, Planet],
  });
  if (!star) return notFound(req, res);
  res.respond(200, { html: "stars/show", json: star, locals: { star } });
};

exports.newForm = async (req, res) => {
  const galaxies = await Galaxy.findAll();
  res.render("stars/new", { star: {}, galaxies, error: null });
};

exports.editForm = async (req, res) => {
  const star = await Star.findByPk(req.params.id);
  if (!star) return notFound(req, res);
  const galaxies = await Galaxy.findAll();
  res.render("stars/edit", { star, galaxies, error: null });
};

exports.create = async (req, res) => {
  try {
    if (req.file) req.body.image = `/uploads/${req.file.filename}`;
    const star = await Star.create(req.body, { fields: ALLOWED });
    if (req.wantsJson()) return res.status(201).json(star);
    return res.redirect(303, `/stars/${star.id}`);
  } catch (err) {
    if (req.wantsJson()) return res.status(400).json({ error: err.message });
    const galaxies = await Galaxy.findAll();
    return res
      .status(400)
      .render("stars/new", { star: req.body, galaxies, error: err.message });
  }
};

exports.update = async (req, res) => {
  const star = await Star.findByPk(req.params.id);
  if (!star) return notFound(req, res);
  try {
    if (req.file) req.body.image = `/uploads/${req.file.filename}`;
    await star.update(req.body, { fields: ALLOWED });
    if (req.wantsJson()) return res.json(star);
    return res.redirect(303, `/stars/${star.id}`);
  } catch (err) {
    if (req.wantsJson()) return res.status(400).json({ error: err.message });
    const galaxies = await Galaxy.findAll();
    return res
      .status(400)
      .render("stars/edit", { star, galaxies, error: err.message });
  }
};

exports.destroy = async (req, res) => {
  const star = await Star.findByPk(req.params.id);
  if (!star) return notFound(req, res);
  await star.destroy();
  if (req.wantsJson()) return res.status(204).send();
  return res.redirect(303, "/stars");
};

exports.addPlanet = async (req, res) => {
  const star = await Star.findByPk(req.params.id);
  if (!star) return notFound(req, res);
  const planet = await Planet.findByPk(req.body.planetId);
  if (!planet) return res.status(404).json({ error: "Planet not found" });
  await star.addPlanet(planet);
  const updated = await Star.findByPk(star.id, { include: Planet });
  if (req.wantsJson()) return res.status(201).json(updated);
  return res.redirect(303, `/stars/${star.id}`);
};

exports.removePlanet = async (req, res) => {
  const star = await Star.findByPk(req.params.id);
  if (!star) return notFound(req, res);
  const planet = await Planet.findByPk(req.params.planetId);
  if (!planet) return res.status(404).json({ error: "Planet not found" });
  await star.removePlanet(planet);
  if (req.wantsJson()) return res.status(204).send();
  return res.redirect(303, `/stars/${star.id}`);
};
