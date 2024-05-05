'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Information extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Information.init({
    title:{type: DataTypes.STRING, allowNull: false},
    description:{type: DataTypes.TEXT, allowNull: false},
    image:{type: DataTypes.STRING, allowNull: false},
    is_active: {type: DataTypes.BOOLEAN, allowNull: false}
  }, {
    sequelize,
    modelName: 'Information',
    tableName: 'informations',
    timestamps: false
  });
  return Information;
};