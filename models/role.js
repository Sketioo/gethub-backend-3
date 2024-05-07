"use strict";
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      role_name: DataTypes.STRING,
    },
    {
      modelName: "Role",
      tableName: "roles",
    }
  );
  Role.associate = function (models) {
    // associations can be defined here
    Role.belongsTo(models.User);
  };
  return Role;
};
