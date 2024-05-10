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
    id: {
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true, 
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER, 
      allowNull: false
    },
    name: {
      type: DataTypes.STRING, 
      allowNull: false
    },
    price: {
      type: DataTypes.STRING, 
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
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
  Product.associate = function (models) {
    // associations can be defined here
    Product.belongsTo(models.User, { foreignKey: "user_id" });
  }
  return Product;
};


// "use strict";
// module.exports = (sequelize, DataTypes) => {
//   const Product = sequelize.define(
//     "Product",
//     {
//     user_id: {type: DataTypes.INTEGER, allowNull: false},
//     name: {type: DataTypes.STRING, allowNull: false},
//     price: {type: DataTypes.STRING, allowNull: false},
//     description: {type: DataTypes.STRING, allowNull: false},
//     image_url: {type: DataTypes.STRING, allowNull: false}
//     },
//     {
//       tableName: "products",
//       modelName: "Product",
//       timestamps: false,
//     }
//   );
//   Product.associate = function (models) {
//     // Asosiasi dengan model Role
//     Product.belongsTo(models.User, { foreignKey: "user_id" });
//   };
//   return Product;
// };
