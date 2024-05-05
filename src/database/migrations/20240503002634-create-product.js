'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: { 
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: { 
        type: Sequelize.STRING,
        allowNull: false,
      },
      size: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
        allowNull: true,
      },
      color: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      offer: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('products')
  }
};
