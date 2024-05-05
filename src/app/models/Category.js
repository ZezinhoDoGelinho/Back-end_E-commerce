import Sequelize, { Model } from 'sequelize';
import { URL } from '../../config';

class Category extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${URL}/category-file/${this.path}`;
          },
        },
      },
      {
        sequelize,
        modelName: 'Category', // Adicionado modelName para evitar problemas ao referenciar a classe
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Product, {
      through: 'categoryProducts', // Nome da tabela pivot
      as: 'products',
      foreignKey: 'categoryid', // Chave estrangeira na tabela pivot referente à categoria
    });
  }
}

export default Category;
