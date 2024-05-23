'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Certification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'user_id' });
      this.belongsTo(models.Category, { foreignKey: 'category_id' });
    }
  }
  Certification.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.UUID,
      references: {
        model: "Category",
        key: "id",
      },
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: "User",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,

    }
  }, {
    sequelize,
    modelName: 'Certification',
    tableName: 'certifications',
    validateUpdateColums() {
      const allowedColumns = ["title", "image", "category"];
      for (const key in this._changed) {
        if (!allowedColumns.includes(key)) {
          throw new Error(`Kolom ${key} tidak dapat diperbarui`);
        }
      }
    }
  }
  );

  return Certification;
};