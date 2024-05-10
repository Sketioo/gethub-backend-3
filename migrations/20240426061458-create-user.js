'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      full_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      user_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      profession: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      web: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      photo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      about: {
        type: Sequelize.STRING,
        allowNull: true
      },
      qr_code: {
        type: Sequelize.STRING
      },
      is_verify: {
        type: Sequelize.BOOLEAN
      },
      is_complete_profile: {
        type: Sequelize.BOOLEAN
      },
      is_premium: {
        type: Sequelize.BOOLEAN
      },
      theme_hub: {
        type: Sequelize.INTEGER
      },
      role_id: { 
        type: Sequelize.UUID,
        references: {
          model: 'Roles',
          key: 'id'
        },
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
