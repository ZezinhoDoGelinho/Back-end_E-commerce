'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'admin')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', {
      admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      }
    })
  }
};
