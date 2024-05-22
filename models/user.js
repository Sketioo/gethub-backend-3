"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      profession: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      web: {
        type: DataTypes.STRING,
        allowNull: true
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      photo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      about: {
        type: DataTypes.STRING,
        allowNull: true
      },
      qr_code: {
        type: DataTypes.STRING, 
        allowNull: true
      },
      is_verify: {
        type: DataTypes.BOOLEAN, 
        allowNull: true,
        defaultValue: false,
      },
      is_complete_profile: {
        type: DataTypes.BOOLEAN, 
        allowNull: true
      },
      is_premium: {
        type: DataTypes.BOOLEAN, 
        allowNull: true
      },
      theme_hub: DataTypes.INTEGER,
    },
    {
      modelName: "User",
      tableName: "users",
      validUpdateColumns() {
        const allowedColumns = ["full_name", "profession", "phone", "web", "address", "photo", "about", "theme_hub"];
        for (const key in this._changed) {
          if (!allowedColumns.includes(key)) {
            throw new Error(`Kolom ${key} tidak dapat diperbarui`);
          }
        }
      }
    }
  );
  User.associate = function (models) {
    // Asosiasi dengan model Role
    User.belongsTo(models.Role, { foreignKey: "role_id" });

    // Asosiasi dengan model EmailVerification
    User.hasOne(models.EmailVerification, { foreignKey: "user_id" });

    // Asosiasi dengan model Product
    User.hasMany(models.Product, { foreignKey: "user_id" });

    // Asosiasi dengan model Link
    User.hasMany(models.Link, { foreignKey: "user_id" });

    // Asosiasi dengan model Partner
    User.hasMany(models.Partner, { foreignKey: "user_id" });

    // Asosiasi dengan model HistoryUpload
    User.hasMany(models.HistoryUpload, { foreignKey: "user_id" });

    // Asosiasi dengan model Certification
    User.hasMany(models.Certification, { foreignKey: "user_id" });

};
  return User;
};
