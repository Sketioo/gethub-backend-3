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
      this.belongsTo(models.User, { foreignKey: "user_id" });
      this.belongsTo(models.Category, {foreignKey: "category_id"})
    }
  }
  Product.init({
    id: {
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true, 
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      references: { model: 'User', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      allowNull: true
    },
    name: {
      type: DataTypes.STRING, 
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category_id: {
      type: DataTypes.UUID,
      references: { model: 'Category', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      allowNull: false
    },
    image_url: {
      type: DataTypes.STRING, 
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
  });
  return Product;
};
