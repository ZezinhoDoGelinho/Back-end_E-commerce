'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('categoryProducts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      productid: {
        type: Sequelize.INTEGER,
        references: { model: 'products', key: 'id'},
        onDelete: 'CASCADE', // isso serve pra quando o produto for excluido, ele limpa essa estrutura
        allowNull: false,
      },
      categoryid: {
        type: Sequelize.INTEGER,
        references: { model: 'categories', key: 'id'},
        onDelete: 'CASCADE', // isso serve pra quando o produto for excluido, ele limpa essa estrutura
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('categoryProducts')
  }
};
