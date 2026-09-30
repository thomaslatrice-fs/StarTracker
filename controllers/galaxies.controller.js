const { Galaxy, Star } = require("../models");

const ALLOWED = ["name", "size", "description", "image"];

function notFound(req, res) {
  if (req.wantsJson())
    return res.status(404).json({ error: "Galaxy not found" });
  return res
    .status(404)
    .render("errors/error", { message: "Galaxy not found" });
}

exports.index = async (req, res) => {
  const galaxies = await Galaxy.findAll();
  res.respond(200, {
    html: "galaxies/index",
    json: galaxies,
    locals: { galaxies },
  });
};

exports.show = async (req, res) => {
  const galaxy = await Galaxy.findByPk(req.params.id, { include: Star });
  if (!galaxy) return notFound(req, res);
  res.respond(200, { html: "galaxies/show", json: galaxy, locals: { galaxy } });
};

// HTML-only: blank create form
exports.newForm = (req, res) => {
  res.render("galaxies/new", { galaxy: {}, error: null });
};

// HTML-only: edit form pre-filled with the galaxy
exports.editForm = async (req, res) => {
  const galaxy = await Galaxy.findByPk(req.params.id);
  if (!galaxy) return notFound(req, res);
  res.render("galaxies/edit", { galaxy, error: null });
};

exports.create = async (req, res) => {
  try {
    if (req.file) req.body.image = `/uploads/${req.file.filename}`;
    const galaxy = await Galaxy.create(req.body, { fields: ALLOWED });
    if (req.wantsJson()) return res.status(201).json(galaxy);
    return res.redirect(303, `/galaxies/${galaxy.id}`);
  } catch (err) {
    if (req.wantsJson()) return res.status(400).json({ error: err.message });
    return res
      .status(400)
      .render("galaxies/new", { galaxy: req.body, error: err.message });
  }
};

exports.update = async (req, res) => {
  const galaxy = await Galaxy.findByPk(req.params.id);
  if (!galaxy) return notFound(req, res);
  try {
    if (req.file) req.body.image = `/uploads/${req.file.filename}`;
    await galaxy.update(req.body, { fields: ALLOWED });
    if (req.wantsJson()) return res.json(galaxy);
    return res.redirect(303, `/galaxies/${galaxy.id}`);
  } catch (err) {
    if (req.wantsJson()) return res.status(400).json({ error: err.message });
    return res
      .status(400)
      .render("galaxies/edit", { galaxy, error: err.message });
  }
};

exports.destroy = async (req, res) => {
  const galaxy = await Galaxy.findByPk(req.params.id);
  if (!galaxy) return notFound(req, res);
  await galaxy.destroy();
  if (req.wantsJson()) return res.status(204).send();
  return res.redirect(303, "/galaxies");
};
