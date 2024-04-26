"use strict";
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      role_name: DataTypes.STRING,
    },
    {
      tableName: "roles",
      timestamps: false,
    }
  );
  Role.associate = function (models) {
    // associations can be defined here
    Role.belongsTo(models.User);
  };
  return Role;
};
