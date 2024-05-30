"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("projects", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      owner_id: {
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category_id: {
        type: Sequelize.UUID,
        references: {
          model: "categories",
          key: "id",
        },
        allowNull: false,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      min_budget: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      max_budget: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      min_deadline: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      max_deadline: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_date: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      chatroom_id: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      banned_message: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status_project: {
        type: Sequelize.ENUM,
        values: ['OPEN', 'BID', 'CLOSE', 'FINISHED'],
        allowNull: false,
        defaultValue: 'OPEN',
      },
      status_freelance_task: {
        type: Sequelize.ENUM,
        values: ['OPEN', 'CLOSE'],
        allowNull: false,
        defaultValue: 'OPEN',
      },
      status_payment: {
        type: Sequelize.ENUM,
        values: ['WAITING', 'SETTLEMENT'],
        allowNull: false,
        defaultValue: 'WAITING',
      },
      fee_owner_transaction_persen: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      fee_owner_transaction_value: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      fee_freelance_transaction_persen: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      fee_freelance_transaction_value: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("projects");
  },
};
