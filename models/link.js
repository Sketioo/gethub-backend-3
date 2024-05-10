"use strict"; // Opening quote was missing here
const { Model, DataTypes } = require("sequelize"); // Importing Sequelize and Model

module.exports = (sequelize) => {
  class Link extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association here
    }
  }
  Link.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.STRING,
        references: { model: 'User', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      link: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Link",
      tableName: "links",
    }
  );
  Link.associate = function (models) {
    // Association with the User model
    Link.belongsTo(models.User, { foreignKey: "user_id" });
  };
  return Link;
};
