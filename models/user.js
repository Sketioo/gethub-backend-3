"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      full_name: { type: DataTypes.STRING, allowNull: false },
      user_name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      profession: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: false },
      web: { type: DataTypes.STRING, allowNull: true },
      address: { type: DataTypes.STRING, allowNull: false },
      photo: { type: DataTypes.STRING, allowNull: true },
      about: { type: DataTypes.STRING, allowNull: true },
      qr_code: { type: DataTypes.STRING, allowNull: true },
      is_verify: { type: DataTypes.BOOLEAN, allowNull: true },
      is_complete_profile: { type: DataTypes.BOOLEAN, allowNull: true },
      is_premium: { type: DataTypes.BOOLEAN, allowNull: true },
      theme_hub: DataTypes.INTEGER,
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );
  User.associate = function (models) {
    // Asosiasi dengan model Role
    User.belongsTo(models.Role, { foreignKey: "role_id" });
  };
  return User;
};
