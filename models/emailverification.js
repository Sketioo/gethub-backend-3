'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmailVerification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EmailVerification.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      references: { model: 'User', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      allowNull: true
    },
    token:{
      type: DataTypes.STRING,
      allowNull: false
    },
    email:{
      type: DataTypes.STRING,
      allowNull: false
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'EmailVerification',
    tableName: 'email_verifications',
    validateUpdateColumns() {
      const allowedColumns = [];
      for (const key in this._changed) {
        if (!allowedColumns.includes(key)) {
          throw new Error(`Kolom ${key} tidak dapat diperbarui`);
        }
      }
    }
  });
  EmailVerification.associate = function (models) {
    EmailVerification.belongsTo(models.User, { foreignKey: "user_id" });
  }
  return EmailVerification;
};