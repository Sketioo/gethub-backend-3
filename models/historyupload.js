"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class HistoryUpload extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  HistoryUpload.init(
    {
      user_id: DataTypes.INTEGER,
      link: DataTypes.STRING,
      extension: DataTypes.STRING,
      date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "HistoryUpload",
      tableName: "history_uploads",
      timestamps: false,
    }
  );
  HistoryUpload.associate = function (models) {
    // associations can be defined here
    HistoryUpload.belongsTo(models.User, { foreignKey: "user_id" });
  };
  return HistoryUpload;
};
