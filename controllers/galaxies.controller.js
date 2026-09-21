const { Galaxy, Star } = require("../models");

const ALLOWED = ["name", "size", "description"];

exports.index = async (req, res) => {
  const galaxies = await Galaxy.findAll();
  res.json(galaxies);
};

exports.show = async (req, res) => {
  const galaxy = await Galaxy.findByPk(req.params.id, { include: Star });
  if (!galaxy) return res.status(404).json({ error: "Galaxy not found" });
  res.json(galaxy);
};

exports.create = async (req, res) => {
  try {
    const galaxy = await Galaxy.create(req.body, { fields: ALLOWED });
    res.status(201).json(galaxy);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const galaxy = await Galaxy.findByPk(req.params.id);
  if (!galaxy) return res.status(404).json({ error: "Galaxy not found" });
  try {
    await galaxy.update(req.body, { fields: ALLOWED });
    res.json(galaxy);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.destroy = async (req, res) => {
  const galaxy = await Galaxy.findByPk(req.params.id);
  if (!galaxy) return res.status(404).json({ error: "Galaxy not found" });
  await galaxy.destroy();
  res.status(204).send();
};
