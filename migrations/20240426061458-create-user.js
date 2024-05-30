'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      role_id: { 
        type: Sequelize.UUID,
        references: {
          model: 'roles',
          key: 'id'
        },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      full_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
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
        type: Sequelize.STRING,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      photo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      expired_membership: {
        type: Sequelize.DATE,
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
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_complete_profile: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_premium: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_verif_ktp: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_verif_ktp_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      theme_hub: {
        type: Sequelize.INTEGER
      },
      sentiment_owner_analisis: {
        type: Sequelize.STRING,
        allowNull: true 
      },
      sentiment_owner_score: { 
        type: Sequelize.INTEGER,
        allowNull: true 
      },
      sentiment_freelance_analisis: { 
        type: Sequelize.STRING,
        allowNull: true 
      },
      sentiment_freelance_score: { 
        type: Sequelize.INTEGER,
        allowNull: true 
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};
