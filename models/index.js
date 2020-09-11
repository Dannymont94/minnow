const User = require('./User');
const Post = require('./Post');
const Favorite = require('./Favorite');

User.hasMany(Post, {
  foreignKey: 'user_id'
});

Post.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'cascade'
});

User.belongsToMany(Post, {
  through: Favorite,
  as: 'favorited_posts',
  foreignKey: 'user_id',
  onDelete: 'cascade'
});

Post.belongsToMany(User, {
  through: Favorite,
  as: 'favorited_posts',
  foreignKey: 'post_id',
  onDelete: 'cascade'
});

User.hasMany(Favorite, {
  foreignKey: 'user_id'
});

Favorite.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'cascade'
});

Post.hasMany(Favorite, {
  foreignKey: 'post_id'
});

Favorite.belongsTo(Post, {
  foreignKey: 'post_id',
  onDelete: 'cascade'
});

module.exports = { User, Post, Favorite };