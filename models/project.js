'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association here
      this.belongsTo(models.User, { foreignKey: 'owner_id' });
      this.hasMany(models.Project_User_Bid, { foreignKey: 'project_id' });
      this.hasMany(models.Project_Task, { foreignKey: 'project_id' });
    }
  }

  Project.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'User', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    min_budget: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    max_budget: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    min_deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    max_deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    chatroom_id: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    banned_message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status_project: {
      type: DataTypes.ENUM('OPEN', 'BID', 'CLOSE', 'FINISHED'),
      allowNull: false,
      defaultValue: 'OPEN',
    },
    status_freelance_task: {
      type: DataTypes.ENUM('OPEN', 'CLOSE'),
      allowNull: false,
      defaultValue: 'OPEN',
    },
    status_payment: {
      type: DataTypes.ENUM('WAITING', 'SETTLEMENT'),
      allowNull: false,
      defaultValue: 'WAITING',
    },
    fee_owner_transaction_persen: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    fee_owner_transaction_value: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    fee_freelance_transaction_persen: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    fee_freelance_transaction_value: {
      type: DataTypes.FLOAT,
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
    modelName: 'Project',
    tableName: 'projects',
  });

  return Project;
};
