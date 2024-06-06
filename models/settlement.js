'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Settlement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Setiap settlement berhubungan dengan satu proyek
      Settlement.belongsTo(models.Project, { as: 'project', foreignKey: 'project_id' });
      // Setiap settlement berhubungan dengan satu freelancer (user)
      Settlement.belongsTo(models.User, { as: 'freelancer', foreignKey: 'freelancer_id' });
    }
  }

  Settlement.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    project_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Projects',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    freelancer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    total_fee_application: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    total_diterima: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    rekening_account: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rekening_bank: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rekening_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: ['Waiting', 'Settle'],
      defaultValue: 'Waiting',
      allowNull: false
    },
    bukti_transfer: {
      type: DataTypes.STRING,
      allowNull: true
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Settlement',
    tableName: 'Settlements',
  });

  return Settlement;
};
