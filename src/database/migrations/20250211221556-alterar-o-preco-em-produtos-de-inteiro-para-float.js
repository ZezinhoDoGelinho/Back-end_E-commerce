'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('products', 'price', {
      type: Sequelize.FLOAT,
        allowNull: false,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('products', 'price', {
      type: Sequelize.INTEGER,
        allowNull: false,
    })
  }
};
