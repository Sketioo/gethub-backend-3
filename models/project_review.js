'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project_Review extends Model {
    static associate(models) {
      this.belongsTo(models.Project, { foreignKey: 'project_id' });
      this.belongsTo(models.User, { as: 'owner', foreignKey: 'owner_id' });
      this.belongsTo(models.User, { as: 'freelancer', foreignKey: 'freelancer_id' });
    }
  }

  Project_Review.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    project_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Project', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'User', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    freelancer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'User', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    review_type: {
      type: DataTypes.ENUM('owner', 'freelancer'),
      allowNull: false
    },
    sentiment: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sentiment_score: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Project_Review',
    tableName: 'project_reviews',
  });

  return Project_Review;
};
