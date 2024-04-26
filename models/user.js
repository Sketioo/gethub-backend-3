'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    //make role_id foreign key to Role model
    role_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Role',
        key: 'id'
      },
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: false
  });
  User.associate = function(models) {
    // associations can be defined here
    User.hasOne(sequelize.define('Role'));
    // User.hasMany(sequelize.define('Post'));
  };
  return User;
};