'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init({
    user_id: {type: DataTypes.INTEGER, allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
    image_url: {type: DataTypes.STRING, allowNull: false}
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: false
  });
  Product.associate = function (models) {
    // associations can be defined here
    Product.belongsTo(models.User, { foreignKey: "user_id" });
  }
  return Product;
};