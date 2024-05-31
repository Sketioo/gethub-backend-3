"use strict";
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      id: { 
        type: DataTypes.UUID, 
        primaryKey: true, 
        defaultValue: DataTypes.UUIDV4 ,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
    },
    {
      modelName: "Role",
      tableName: "roles",
      validateUpdateColumns() {
        const allowedColumns = ["name"];
        for (const key in this._changed) {
          if (!allowedColumns.includes(key)) {
            throw new Error(`Kolom ${key} tidak dapat diperbarui`);
          }
        }
      }
    }
  );
  Role.associate = function (models) {
    // associations can be defined here
    Role.hasMany(models.User, {as: 'role', foreignKey: 'role_id'});
  };
  return Role;
};
