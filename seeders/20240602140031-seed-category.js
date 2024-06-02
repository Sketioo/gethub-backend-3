'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = [
      'Web Development',
      'Mobile App Development',
      'Design Grafis dan Multimedia',
      'Analisis Data',
      'Desain UI&UX',
      'Game Development',
      'Integrasi API',
      'Fotografi dan Videografi',
      'Penulisan Konten',
      'Penulisan Artikel dan Blog',
      'Penerjemah Bahasa',
      'Proofreading dan Editing',
      'Pemasaran Digital',
      'Penelitian Pasar',
      'Animasi dan Motion Graphics',
      'SEO dan SEM',
      'Konsultasi Bisnis',
      'Manajemen Proyek',
      'Riset dan Strategi Keuangan',
      'Akuntansi dan Pembukuan',
      'Prototyping dan Pengujian',
      'Manajemen Komunitas',
      'Layanan Virtual Assistant',
      'Desain Teknik dan CAD',
      'Arsitektur dan Perencanaan Kota',
      'Pemasaran Afiliasi',
      'Audio Editing',
      'Pengajar Bahasa',
      'Konsultasi Bahasa',
      'Admin',
      'Perencanaan Acara/Event Planning',
      'Project Management',
      'Analisis Finansial',
      'Voice Acting',
      'Data entry'
    ];

    const categoryData = categories.map(name => ({
      id: uuidv4(),
      name: name,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('categories', categoryData, {});
  },

  down: async (queryInterface, Sequelize) => {
    const categoryNames = [
      'Web Development',
      'Mobile App Development',
      'Design Grafis dan Multimedia',
      'Analisis Data',
      'Desain UI&UX',
      'Game Development',
      'Integrasi API',
      'Fotografi dan Videografi',
      'Penulisan Konten',
      'Penulisan Artikel dan Blog',
      'Penerjemah Bahasa',
      'Proofreading dan Editing',
      'Pemasaran Digital',
      'Penelitian Pasar',
      'Animasi dan Motion Graphics',
      'SEO dan SEM',
      'Konsultasi Bisnis',
      'Manajemen Proyek',
      'Riset dan Strategi Keuangan',
      'Akuntansi dan Pembukuan',
      'Prototyping dan Pengujian',
      'Manajemen Komunitas',
      'Layanan Virtual Assistant',
      'Desain Teknik dan CAD',
      'Arsitektur dan Perencanaan Kota',
      'Pemasaran Afiliasi',
      'Audio Editing',
      'Pengajar Bahasa',
      'Konsultasi Bahasa',
      'Admin',
      'Perencanaan Acara/Event Planning',
      'Project Management',
      'Analisis Finansial',
      'Voice Acting',
      'Data entry'
    ];

    await queryInterface.bulkDelete('categories', {
      name: categoryNames
    }, {});
  }
};
