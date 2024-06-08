'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('banks', [
      {
        id: uuidv4(),
        bank_name: 'Bank BCA',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        bank_name: 'Bank Mandiri',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        bank_name: 'Bank BNI',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        bank_name: 'Bank BRI',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        bank_name: 'Bank Syariah Indonesia (BSI)',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        bank_name: 'Bank Permata',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('banks', null, {});
  }
};
