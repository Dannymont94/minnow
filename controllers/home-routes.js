const router = require('express').Router();
const { User, Post, Favorite } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
  const allPosts = await Post.findAll({
    include: [
      {
        model: User,
        attributes: ['username']
      }
    ],
    order: [
      ['id', 'DESC']
    ]
  });

  const usersFavoritedPosts = await Favorite.findAll({
    where: {
      user_id: req.session.user_id
    },
    attributes: ['post_id']
  });

  const favorites = usersFavoritedPosts.map(post => {
    return post.post_id
  });

  const postsWithFavorite = allPosts.map(post => {
    if (favorites.includes(post.id)) {
      post.dataValues.favorited = true;
    }
    return post;
  });

  const posts = postsWithFavorite.map(post => post.get({ plain: true }));

  res.render('homepage', {
    posts, 
    loggedIn: req.session.loggedIn
  });
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.status(200).render('login');
});

router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.status(200).render('signup');
});

router.get('/post/:id', withAuth, async (req, res) => {
  const singlePost = await Post.findAll({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: User,
        attributes: ['username']
      }
    ]
  });

  if (!singlePost[0]) {
    res.status(404).json({ message: 'No post found with that id' });
    return;
  }

  const usersFavoritedPosts = await Favorite.findAll({
    where: {
      user_id: req.session.user_id
    },
    attributes: ['post_id']
  });

  const favorites = usersFavoritedPosts.map(post => {
    return post.post_id
  });

  const postsWithFavorite = singlePost.map(post => {
    if (favorites.includes(post.id)) {
      post.dataValues.favorited = true;
    }
    return post;
  });

  const posts = postsWithFavorite.map(post => post.get({ plain: true }));

  res.status(200).render('single-post', {
    post: posts[0],
    loggedIn: req.session.loggedIn 
  });
});

module.exports = router;