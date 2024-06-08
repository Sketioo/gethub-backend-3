'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      User.belongsTo(models.Role, { as: 'role', foreignKey: "role_id" });
      User.hasOne(models.EmailVerification, { foreignKey: "user_id" });
      User.hasMany(models.Product, { as: 'products', foreignKey: "user_id" });
      User.hasMany(models.Link, { as: 'links', foreignKey: "user_id" });
      User.hasMany(models.Partner, { foreignKey: "user_id" });
      User.hasMany(models.HistoryUpload, { foreignKey: "user_id" });
      User.hasMany(models.Certification, { as: 'certifications', foreignKey: "user_id" });
      User.hasMany(models.Project, { as: 'owner_project', foreignKey: "owner_id" });
      User.hasMany(models.Project_User_Bid, { as: 'users_bid', foreignKey: 'user_id' });
      User.hasMany(models.Project_Review, { as: 'owner', foreignKey: 'owner_id' });
      // User.hasMany(models.Project_Review, { as: 'freelancer', foreignKey: 'freelancer_id' });
      User.hasMany(models.Project_Task, { as: 'freelancer', foreignKey: 'freelancer_id' });
      User.hasMany(models.Card_Viewers, { as: 'profileUser', foreignKey: 'profile_user_id' });
      User.hasMany(models.Transaction, {as: 'user', foreignKey: 'user_id'})
    }

    static async setDefaultRole(user) {
      const defaultRole = await sequelize.models.Role.findOne({ where: { name: 'user' } });
      if (defaultRole) {
        user.role_id = defaultRole.id;
      }
    }
  }

  User.init({
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
      allowNull: false,
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
    premium_expired_date: {
      type: DataTypes.DATE,
      allowNull: true
    },    
    is_verif_ktp: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    is_verif_ktp_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Role", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    theme_hub: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sentiment_owner_analisis: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sentiment_owner_score: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    sentiment_freelance_analisis: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sentiment_freelance_score: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    is_visibility: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    hooks: {
      beforeCreate: async (user, options) => {
        await User.setDefaultRole(user);
      },
      beforeUpdate: (user, options) => {
        User.validateUpdateColumns(user);
      }
    }
  });

  User.validateUpdateColumns = function (user) {
    const allowedColumns = [
      "full_name", "profession", "phone", "web", "address", "photo", "about",
      "theme_hub", "sentiment_owner_analisis", "sentiment_owner_score",
      "sentiment_freelance_analisis", "sentiment_freelance_score"
    ];
    for (const key in user._changed) {
      if (!allowedColumns.includes(key)) {
        throw new Error(`Kolom ${key} tidak dapat diperbarui`);
      }
    }
  };

  return User;
};
