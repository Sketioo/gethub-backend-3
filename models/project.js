'use strict';
const {
  Model
} = require('sequelize');
const { differenceInDays } = require('date-fns');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association here
      this.belongsTo(models.User, { as: 'owner_project', foreignKey: 'owner_id' });
      this.hasMany(models.Project_User_Bid, { as: 'users_bid', foreignKey: 'project_id' });
      this.hasMany(models.Project_Task, { as: "project_tasks", foreignKey: 'project_id' });
      this.belongsTo(models.Category, { as: 'category', foreignKey: 'category_id' });
      this.hasMany(models.Project_Review, { foreignKey: 'project_id' });
      this.hasMany(models.Transaction, { as: 'project', foreignKey: 'project_id' });
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
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Category', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    min_budget: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        budgetRange() {
          if (this.min_budget > this.max_budget) {
            throw new Error('Minimum budget cannot be greater than maximum budget');
          }
        }
      }
    },
    max_budget: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    max_deadline: {
      type: DataTypes.DATE,
      allowNull: false,
      set(value) {
        if (new Date(value) < new Date(this.min_deadline)) {
          throw new Error('Max deadline cannot be before min deadline');
        }
        this.setDataValue('max_deadline', value);
      }
    },
    min_deadline: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      set(value) {
        if (new Date(value) > new Date(this.max_deadline)) {
          throw new Error('Min deadline cannot be after max deadline');
        }
        this.setDataValue('min_deadline', value);
      }
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deadline_duration: {
      type: DataTypes.VIRTUAL,
      get() {
        const minDeadline = this.getDataValue('min_deadline');
        const maxDeadline = this.getDataValue('max_deadline');
        if (minDeadline && maxDeadline) {
          const daysDifference = differenceInDays(new Date(maxDeadline), new Date(minDeadline));
          return `${daysDifference}`;
        }
        return null;
      }
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
      type: DataTypes.ENUM('OPEN','CLOSE', 'FINISHED'),
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
