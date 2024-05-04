"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sponsor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Sponsor.init(
    {
      image_url: { type: DataTypes.STRING, allowNull: false },
      link: { type: DataTypes.STRING, allowNull: false },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "Sponsor",
      tableName: "sponsors",
      timestamps: false,
    }
  );
  return Sponsor;
};
