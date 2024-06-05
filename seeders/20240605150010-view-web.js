'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const profileUserId = "84dd448f-96cd-4bce-96fb-0c4b9e766984";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ipAddresses = ["192.168.0.1", "192.168.0.2", "192.168.0.3", "192.168.0.4", "192.168.0.5", "192.168.0.6", "192.168.0.7", "192.168.0.8", "192.168.0.9", "192.168.0.10"];
    const dates = [];

    // Generate dates for the last 10 days
    for (let i = 0; i < 10; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() - i);
      dates.push(currentDate);
    }

    // Insert data into the table
    const bulkInsertData = [];
    for (let i = 0; i < 10; i++) {
      bulkInsertData.push({
        id: uuidv4(),
        profile_user_id: profileUserId,
        ip: ipAddresses[i],
        date: dates[i],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('web_viewers', bulkInsertData, {});
  },

  async down(queryInterface, Sequelize) {
    // Remove the data inserted in the 'up' method
    await queryInterface.bulkDelete('web_viewers', {
      profile_user_id: "84dd448f-96cd-4bce-96fb-0c4b9e766984"
    }, {});
  }
};
