"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Partner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Partner.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.STRING,
        references: { model: 'User', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: true
      },
      ref_user_id: { type: DataTypes.INTEGER, allowNull: true },
      full_name: { 
        type: DataTypes.STRING 
      },
      profession: { 
        type: DataTypes.STRING 
      },
      email: { 
        type: DataTypes.STRING 
      },
      phone: { 
        type: DataTypes.STRING 
      },
      photo: { 
        type: DataTypes.STRING 
      },
      address: { 
        type: DataTypes.STRING 
      },
      website: { 
        type: DataTypes.STRING 
      },
      image_url: { 
        type: DataTypes.STRING 
      },
    },
    {
      sequelize,
      modelName: "Partner",
      tableName: "partners",
    }
  );
  Partner.associate = function (models) {
    // associations can be defined here
    Partner.belongsTo(models.User, { foreignKey: "user_id" });
    models.User.hasMany(Partner, { foreignKey: "user_id" });
  };
  return Partner;
};
