const { Planet, Star } = require("../models");

const ALLOWED = ["name", "size", "description", "image"];

function notFound(req, res) {
  if (req.wantsJson())
    return res.status(404).json({ error: "Planet not found" });
  return res
    .status(404)
    .render("errors/error", { message: "Planet not found" });
}

function normalizeStarIds(body) {
  if (!body.starIds) return [];
  return Array.isArray(body.starIds) ? body.starIds : [body.starIds];
}

exports.index = async (req, res) => {
  const planets = await Planet.findAll();
  res.respond(200, {
    html: "planets/index",
    json: planets,
    locals: { planets },
  });
};

exports.show = async (req, res) => {
  const planet = await Planet.findByPk(req.params.id, { include: Star });
  if (!planet) return notFound(req, res);
  res.respond(200, { html: "planets/show", json: planet, locals: { planet } });
};

exports.newForm = async (req, res) => {
  const stars = await Star.findAll();
  res.render("planets/new", {
    planet: {},
    stars,
    selectedStarIds: [],
    error: null,
  });
};

exports.editForm = async (req, res) => {
  const planet = await Planet.findByPk(req.params.id, { include: Star });
  if (!planet) return notFound(req, res);
  const stars = await Star.findAll();
  const selectedStarIds = planet.Stars.map((s) => s.id);
  res.render("planets/edit", { planet, stars, selectedStarIds, error: null });
};

exports.create = async (req, res) => {
  try {
    if (req.file) req.body.image = `/uploads/${req.file.filename}`;
    const planet = await Planet.create(req.body, { fields: ALLOWED });
    await planet.setStars(normalizeStarIds(req.body));
    if (req.wantsJson()) return res.status(201).json(planet);
    return res.redirect(303, `/planets/${planet.id}`);
  } catch (err) {
    if (req.wantsJson()) return res.status(400).json({ error: err.message });
    const stars = await Star.findAll();
    return res.status(400).render("planets/new", {
      planet: req.body,
      stars,
      selectedStarIds: normalizeStarIds(req.body),
      error: err.message,
    });
  }
};

exports.update = async (req, res) => {
  const planet = await Planet.findByPk(req.params.id);
  if (!planet) return notFound(req, res);
  try {
    if (req.file) req.body.image = `/uploads/${req.file.filename}`;
    await planet.update(req.body, { fields: ALLOWED });
    await planet.setStars(normalizeStarIds(req.body));
    if (req.wantsJson()) return res.json(planet);
    return res.redirect(303, `/planets/${planet.id}`);
  } catch (err) {
    if (req.wantsJson()) return res.status(400).json({ error: err.message });
    const stars = await Star.findAll();
    return res.status(400).render("planets/edit", {
      planet,
      stars,
      selectedStarIds: normalizeStarIds(req.body),
      error: err.message,
    });
  }
};

exports.destroy = async (req, res) => {
  const planet = await Planet.findByPk(req.params.id);
  if (!planet) return notFound(req, res);
  await planet.destroy();
  if (req.wantsJson()) return res.status(204).send();
  return res.redirect(303, "/planets");
};
