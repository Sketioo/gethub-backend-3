'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      // Define association here
      Transaction.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
      Transaction.belongsTo(models.Project, { as: 'project', foreignKey: 'project_id' });
    }
  }

  Transaction.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    project_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Project', key: 'id' },
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'User', key: 'id' },
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    transaction_type: {
      type: DataTypes.ENUM('DEPOSIT', 'PAYMENT', 'REFUND'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELED'),
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transaction_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    snap_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    snap_redirect: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'Transaction',
    tableName: 'transactions',
  });

  return Transaction;
};
