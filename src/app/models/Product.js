import Sequelize, { Model } from 'sequelize';
import { URL } from '../../config';

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        size: Sequelize.ARRAY(Sequelize.STRING),
        color: Sequelize.ARRAY(Sequelize.STRING),
        description: Sequelize.STRING,
        price: Sequelize.INTEGER,
        offer: Sequelize.BOOLEAN,
        images: Sequelize.ARRAY(Sequelize.STRING),
        imagesUrls: {
          type: Sequelize.VIRTUAL(Sequelize.ARRAY(Sequelize.STRING)),
          get() {
            const { images } = this;

            if (!images || images.length === 0) {
              return [];
            }

            const imageURLs = images.map(img => `${URL}/product-images/${img}`);
            return imageURLs;
          },
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Category, {
      through: 'categoryProducts', // Nome da tabela pivot
      as: 'categories',
      foreignKey: 'productid', // Nome da chave estrangeira na tabela pivot referente ao produto
      otherKey: 'categoryid', // Nome da chave estrangeira na tabela pivot referente à categoria
    });
  }
}

export default Product;
