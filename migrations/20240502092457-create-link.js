"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Links", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        allowNull: true,
      },
      category: {
        type: Sequelize.STRING,
      },
      link: {
        type: Sequelize.STRING,
      },
    });
  },
  down:(queryInterface, Sequelize) => {
    return queryInterface.dropTable("Links");
  },
};
