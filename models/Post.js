const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Post extends Model {
  static async favorite(user_id, post_id, Favorite, Post) {
    await Favorite.create({
      user_id,
      post_id
    });

    return await Post.findOne({
      where: {
        id: post_id
      }
    });
  }
  
  static async unfavorite(user_id, post_id, Favorite) {
    return await Favorite.destroy({
      where: {
        user_id,
        post_id
      }
    });
  }

  static async findFavorite(user_id, post_id, Favorite) {
    return await Favorite.findOne({
      where: {
        user_id,
        post_id
      }
    });
  }
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },    
    source: {
      type: DataTypes.STRING,
      allowNull: false
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    caption: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    palette: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        return this.getDataValue('palette').split(';');
      },
      set(value) {
        return this.setDataValue('palette', value.join(';'));
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'post'
  }
);

module.exports = Post;