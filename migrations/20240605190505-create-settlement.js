'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('settlements', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      project_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'projects',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      freelancer_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      total_fee_application: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      total_diterima: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      rekening_account: {
        type: Sequelize.STRING,
        allowNull: false
      },
      rekening_bank: {
        type: Sequelize.STRING,
        allowNull: false
      },
      rekening_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM,
        values: ['Waiting', 'Settle'],
        defaultValue: 'Waiting',
        allowNull: false
      },
      bukti_transfer: {
        type: Sequelize.STRING,
        allowNull: true
      },
      message: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('settlements');
  }
};
