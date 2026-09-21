const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./star-tracker.sqlite",
  logging: false,
});

// All three resources share the same three fields
const fields = () => ({
  name: { type: DataTypes.STRING, allowNull: false },
  size: { type: DataTypes.INTEGER, allowNull: false },
  description: { type: DataTypes.TEXT },
});

const Galaxy = sequelize.define("Galaxy", fields());
const Star = sequelize.define("Star", fields());
const Planet = sequelize.define("Planet", fields());

// Join table for the many-to-many between stars and planets
const StarsPlanets = sequelize.define(
  "StarsPlanets",
  {},
  { timestamps: false },
);

// Galaxy has many Stars / Star belongs to a Galaxy
Galaxy.hasMany(Star, { foreignKey: "galaxyId" });
Star.belongsTo(Galaxy, { foreignKey: "galaxyId" });

// Star has many Planets / Planet belongs to many Stars (via StarsPlanets)
Star.belongsToMany(Planet, { through: StarsPlanets });
Planet.belongsToMany(Star, { through: StarsPlanets });

module.exports = { sequelize, Galaxy, Star, Planet, StarsPlanets };
