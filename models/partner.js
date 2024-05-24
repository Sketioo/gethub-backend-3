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
        type: DataTypes.UUID,
        references: { model: 'User', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: true
      },
      ref_user_id: { 
        type: DataTypes.STRING, 
        allowNull: true 
      },
      full_name: { 
        type: DataTypes.STRING,
        allowNull: false
      },
      profession: { 
        type: DataTypes.STRING,
        allowNull: true
      },
      email: { 
        type: DataTypes.STRING ,
        allowNull: false
      },
      phone: { 
        type: DataTypes.STRING ,
        allowNull: false
      },
      photo: { 
        type: DataTypes.STRING ,
        allowNull: true
      },
      address: { 
        type: DataTypes.STRING ,
        allowNull: true
      },
      website: { 
        type: DataTypes.STRING ,
        allowNull: true
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

  };
  return Partner;
};
