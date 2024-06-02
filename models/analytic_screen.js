'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Analytic_Screen extends Model {
    static associate(models) {
      this.belongsTo(models.User, { as: 'profileUser', foreignKey: 'profile_user_id'});
      this.belongsTo(models.User, { as: 'viewUser', foreignKey: 'view_user_id'});
    }
  };

  Analytic_Screen.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
    profile_user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
    view_user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Analytic_Screen',
    tableName: 'analytic_screen'
  });
  return Analytic_Screen;
};
