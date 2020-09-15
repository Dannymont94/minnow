const router = require('express').Router();
const {User, Post, Favorite } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id 
        },
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.status(200).render('dashboard', { posts });
    })
    .catch( err => {
        console.log(err);
        res.status(500).json(err);
    });
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
        res.render('edit-post', { post });
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
        ]
    })
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.status(200).render('favorites', { posts });
    })
})

module.exports = router;