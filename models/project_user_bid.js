'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project_User_Bid extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association here
      Project_User_Bid.belongsTo(models.User, { foreignKey: 'user_id' });
      Project_User_Bid.belongsTo(models.Project, { foreignKey: 'project_id' });
    }
  }
  Project_User_Bid.init({
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
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'User', key: 'id' },
    },
    budget_bid: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_selected: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'Project_User_Bid',
    tableName: 'project_user_bids',
  });
  return Project_User_Bid;
};
