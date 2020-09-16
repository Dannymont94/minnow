const router = require('express').Router();
const { User, Post, Favorite } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
    const usersPosts = await Post.findAll({
        where: {
            user_id: req.session.user_id 
        },
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

    const postsWithFavorite = usersPosts.map(post => {
        if (favorites.includes(post.id)) {
            post.dataValues.favorited = true;
        }
        return post;
    });

    const posts = postsWithFavorite.map(post => post.get({ plain: true }));

    res.render('dashboard', {
        posts, 
            posts,
        posts, 
        loggedIn: req.session.loggedIn
    });
});

router.get('/add-post', withAuth, (req, res) => {
    res.render('add-post', { loggedIn: req.session.loggedIn });
});

router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id 
        },
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        const post = dbPostData.get({ plain: true });
        res.render('edit-post', {
            post,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/favorites', withAuth, (req, res) => {
    Favorite.findAll({
        where: {
            user_id: req.session.user_id
        },
        include: [
            {
                model: Post,
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ],
        order: [
            ['id', 'DESC']
        ]
    })
    .then(dbPostData => {
        const favorites = dbPostData.map(post => post.get({ plain: true }));

        const posts = favorites.map(favorite => {
            favorite.post.favorited = true;
            return favorite;
        });

        res.status(200).render('favorites', {
            posts,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;