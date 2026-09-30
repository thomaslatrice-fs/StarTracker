"use strict";

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn("Galaxies", "image", {
      type: Sequelize.STRING,
      allowNull: true,
    }),
  down: (queryInterface) => queryInterface.removeColumn("Galaxies", "image"),
};
