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
      this.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  Partner.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.UUID,
        references: { model: 'User', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: true
      },
      ref_user_id: { 
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'User', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      full_name: { 
        type: DataTypes.STRING,
        allowNull: true
      },
      profession: { 
        type: DataTypes.STRING,
        allowNull: true
      },
      email: { 
        type: DataTypes.STRING ,
        allowNull: true
      },
      phone: { 
        type: DataTypes.STRING ,
        allowNull: true
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
  return Partner;
};
