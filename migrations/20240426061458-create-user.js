'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      web: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
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
      isVerify: {
        type: Sequelize.BOOLEAN
      },
      is_complete_profile: {
        type: Sequelize.BOOLEAN
      },
      isPremium: {
        type: Sequelize.BOOLEAN
      },
      theme_hub: {
        type: Sequelize.INTEGER
      },
      role_id: { // Menambahkan field role_id sebagai foreign key
        type: Sequelize.INTEGER,
        references: {
          model: 'Roles', // Mengubah model menjadi 'Roles'
          key: 'id'
        },
        allowNull: true
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
