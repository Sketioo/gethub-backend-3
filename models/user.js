"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4  },
      full_name: { type: DataTypes.STRING, allowNull: false },
      user_name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      profession: { type: DataTypes.STRING, allowNull: true },
      phone: { type: DataTypes.STRING, allowNull: true },
      web: { type: DataTypes.STRING, allowNull: true },
      address: { type: DataTypes.STRING, allowNull: true },
      photo: { type: DataTypes.STRING, allowNull: true },
      about: { type: DataTypes.STRING, allowNull: true },
      qr_code: { type: DataTypes.STRING, allowNull: true },
      is_verify: { type: DataTypes.BOOLEAN, allowNull: true },
      is_complete_profile: { type: DataTypes.BOOLEAN, allowNull: true },
      is_premium: { type: DataTypes.BOOLEAN, allowNull: true },
      theme_hub: DataTypes.INTEGER,
    },
    {
      modelName: "User",
      tableName: "users",
    }
  );
  User.associate = function (models) {
    // Asosiasi dengan model Role
    User.belongsTo(models.Role, { foreignKey: "role_id" });
    models.Role.hasOne(User, {foreignKey: "role_id"});
    User.hasMany(models.Product, { foreignKey: "user_id" });
    models.Product.belongsTo(User, {foreignKey: "user_id"});
    models.Link.belongsTo(User, {foreignKey: "user_id"});
    User.hasMany(models.Link, { foreignKey: "user_id" });
  };
  return User;
};
