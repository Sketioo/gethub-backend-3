'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project_Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Each task belongs to one project
      Project_Task.belongsTo(models.Project, { foreignKey: 'project_id' });
      // Each task can be assigned to one freelance user
      Project_Task.belongsTo(models.User, { foreignKey: 'task_freelance_id' });
    }
  }
  Project_Task.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    project_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Projects',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    task_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    task_description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    task_status: {
      type: DataTypes.ENUM('REVIEW', 'REVISION', 'DONE'),
      allowNull: false
    },
    task_freelance_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    task_feedback: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Project_Task',
  });
  return Project_Task;
};
