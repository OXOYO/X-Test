/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('msg_group', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    group_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    content_type: {
      type: DataTypes.CHAR(100),
      allowNull: false
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'msg_group'
  });
};
