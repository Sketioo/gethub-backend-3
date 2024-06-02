'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Card_Viewers extends Model {
    static associate(models) {
      this.belongsTo(models.User, { as: 'profileUser', foreignKey: 'profile_user_id'});
      this.belongsTo(models.User, { as: 'viewUser', foreignKey: 'view_user_id'});
    }
  };

  Card_Viewers.init({
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
    modelName: 'Card_Viewers',
    tableName: 'card_viewers'
  });
  return Card_Viewers;
};
