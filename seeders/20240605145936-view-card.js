'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const profileUserId = "84dd448f-96cd-4bce-96fb-0c4b9e766984";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const duahari = new Date(today);
    duahari.setDate(today.getDate() - 2);
    const tigahari = new Date(today);
    tigahari.setDate(today.getDate() - 3); 
    const empathari = new Date(today)
    empathari.setDate(today.getDate() - 4);
    const limahari = new Date(today)
    limahari.setDate(today.getDate() - 5);
    const enamhari = new Date(today)
    enamhari.setDate(today.getDate() - 6);
    const tujuhhari = new Date(today)
    tujuhhari.setDate(today.getDate() - 7);
    const delapanhari = new Date(today)
    delapanhari.setDate(today.getDate() - 8);
    const sembilanhari = new Date(today)
    sembilanhari.setDate(today.getDate() - 9);
    const sepuluhhari = new Date(today)
    sepuluhhari.setDate(today.getDate() - 10);
    

    // Insert data into the table
    await queryInterface.bulkInsert('card_viewers', [
      {
        id: uuidv4(),
        profile_user_id: profileUserId,
        view_user_id: 'f520b924-0523-4942-965c-20289192b6c7',
        date: today,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        profile_user_id: profileUserId,
        view_user_id: '2685396b-5b96-4fcd-b183-fc635af854ae',
        date: yesterday,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        profile_user_id: profileUserId,
        view_user_id: '482059b5-cc87-47e3-b3fb-c58d993df3bb',
        date: duahari,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        profile_user_id: profileUserId,
        view_user_id: '4d237165-1827-45c5-a073-cd6bad55325b',
        date: tigahari,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        profile_user_id: profileUserId,
        view_user_id: '4e1afbe1-b868-45d4-8e81-19871a0f55d2',
        date: empathari,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        profile_user_id: profileUserId,
        view_user_id: '5a925455-082f-4f32-bc92-f357c66d127f',
        date: limahari,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        profile_user_id: profileUserId,
        view_user_id: '5aa553ab-757f-4ef6-ac51-081604623503',
        date: enamhari,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        profile_user_id: profileUserId,
        view_user_id: '6ff1cd2c-45d0-4173-a1b6-c0ed290d1c84',
        date: tujuhhari,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        profile_user_id: profileUserId,
        view_user_id: '84dd448f-96cd-4bce-96fb-0c4b9e766984',
        date: delapanhari,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        profile_user_id: profileUserId,
        view_user_id: 'a51e33c0-bd4b-4fe9-8967-b344c38551ed',
        date: sembilanhari,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('card_viewers', {
      profile_user_id: "84dd448f-96cd-4bce-96fb-0c4b9e766984"
    }, {});
  }
};
