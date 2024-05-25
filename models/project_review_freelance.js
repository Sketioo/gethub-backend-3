'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project_Review_Freelance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association here
      this.belongsTo(models.Project, { foreignKey: 'project_id' });
      this.belongsTo(models.User, { as: 'owner', foreignKey: 'owner_id' });
      this.belongsTo(models.User, { as: 'freelancer', foreignKey: 'freelance_id' });
    }
  }

  Project_Review_Freelance.init({
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
    freelance_id: {
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
    modelName: 'Project_Review_Freelance',
    tableName: 'project_review_freelances',
  });

  return Project_Review_Freelance;
};
