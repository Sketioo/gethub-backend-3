"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Sponsors", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      image_url: {
        type: Sequelize.STRING,
      },
      link: {
        type: Sequelize.STRING,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Sponsors");
  },
};
