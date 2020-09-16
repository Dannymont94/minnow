const router = require('express').Router();
const { User, Post, Favorite } = require('../models');

router.get('/', async (req, res) => {
    if (req.session.user_id) {
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
    } else {
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
        })
        
        const posts = allPosts.map(post => post.get({ plain: true }));
        res.status(200).render('homepage', {
            posts,
            loggedIn: req.session.loggedIn
        });
    }
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

router.get('/post/:id', (req, res) => {
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

        res.status(200).render('single-post', {
            post,
            loggedIn: req.session.loggedIn 
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;