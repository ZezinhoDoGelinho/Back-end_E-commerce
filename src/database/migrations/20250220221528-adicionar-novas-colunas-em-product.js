'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'supplier', {
      type: Sequelize.STRING,
      allowNull: true,
    })

    await queryInterface.addColumn('products', 'offerValue', {
      type: Sequelize.FLOAT,
      allowNull: true,
    })
    
    await queryInterface.addColumn('products', 'purchasePrice', {
      type: Sequelize.FLOAT,
      allowNull: true,
    })

    await queryInterface.addColumn('products', 'dateOfPurchase', {
      type: Sequelize.DATE,
      allowNull: true,
    })

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Tabela', 'offerValue');
    await queryInterface.removeColumn('Tabela', 'purchasePrice');
    await queryInterface.removeColumn('Tabela', 'dateOfPurchase');
  }
};
