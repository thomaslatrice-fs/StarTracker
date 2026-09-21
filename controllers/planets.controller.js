const { Planet, Star } = require("../models");

const ALLOWED = ["name", "size", "description"];

exports.index = async (req, res) => {
  const planets = await Planet.findAll();
  res.json(planets);
};

exports.show = async (req, res) => {
  const planet = await Planet.findByPk(req.params.id, { include: Star });
  if (!planet) return res.status(404).json({ error: "Planet not found" });
  res.json(planet);
};

exports.create = async (req, res) => {
  try {
    const planet = await Planet.create(req.body, { fields: ALLOWED });
    res.status(201).json(planet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const planet = await Planet.findByPk(req.params.id);
  if (!planet) return res.status(404).json({ error: "Planet not found" });
  try {
    await planet.update(req.body, { fields: ALLOWED });
    res.json(planet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.destroy = async (req, res) => {
  const planet = await Planet.findByPk(req.params.id);
  if (!planet) return res.status(404).json({ error: "Planet not found" });
  await planet.destroy();
  res.status(204).send();
};
