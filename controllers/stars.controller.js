const { Star, Galaxy, Planet } = require("../models");

const ALLOWED = ["name", "size", "description", "galaxyId"];

exports.index = async (req, res) => {
  const stars = await Star.findAll();
  res.json(stars);
};

exports.show = async (req, res) => {
  const star = await Star.findByPk(req.params.id, {
    include: [Galaxy, Planet],
  });
  if (!star) return res.status(404).json({ error: "Star not found" });
  res.json(star);
};

exports.create = async (req, res) => {
  try {
    const star = await Star.create(req.body, { fields: ALLOWED });
    res.status(201).json(star);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const star = await Star.findByPk(req.params.id);
  if (!star) return res.status(404).json({ error: "Star not found" });
  try {
    await star.update(req.body, { fields: ALLOWED });
    res.json(star);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.destroy = async (req, res) => {
  const star = await Star.findByPk(req.params.id);
  if (!star) return res.status(404).json({ error: "Star not found" });
  await star.destroy();
  res.status(204).send();
};

exports.addPlanet = async (req, res) => {
  const star = await Star.findByPk(req.params.id);
  if (!star) return res.status(404).json({ error: "Star not found" });
  const planet = await Planet.findByPk(req.body.planetId);
  if (!planet) return res.status(404).json({ error: "Planet not found" });
  await star.addPlanet(planet);
  const updated = await Star.findByPk(star.id, { include: Planet });
  res.status(201).json(updated);
};

exports.removePlanet = async (req, res) => {
  const star = await Star.findByPk(req.params.id);
  if (!star) return res.status(404).json({ error: "Star not found" });
  const planet = await Planet.findByPk(req.params.planetId);
  if (!planet) return res.status(404).json({ error: "Planet not found" });
  await star.removePlanet(planet);
  res.status(204).send();
};
