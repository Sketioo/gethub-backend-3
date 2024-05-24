'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Category has many product, project, and certification
      this.hasMany(models.Product, { foreignKey: 'category_id' });
      this.hasMany(models.Project, { foreignKey: 'category_id' });
      this.hasMany(models.Certification, { foreignKey: 'category_id' });
      this.hasOne(models.Category, {foreignKey: 'category_id'})
    }
  }
  Category.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    validateUpdateColumns() {
      const allowedColumns = ["name"];
      for (const key in this._changed) {
        if (!allowedColumns.includes(key)) {
          throw new Error(`Kolom ${key} tidak dapat diperbarui`);
        }
      }
    }
  });

  return Category;
};