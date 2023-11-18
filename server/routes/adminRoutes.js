const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const authenticateAdmin = require('../middleware/authenticateAdmin');
const User = require('../models/User');
const Blog = require('../models/Blog');

//admin dashboard (default)
router.get('/', authenticateToken, authenticateAdmin, async (req, res) => {
    //if it got here, it passed admin authentication. congrats!
    res.status(200).send('Admin Dashboard');
});


//view all users
router.get('/users', authenticateToken, authenticateAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving users');
    }
});

//route to block/Disable a user
router.put('/block/:userId', authenticateToken, authenticateAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        if (user.isBlocked) {
            return res.status(422).send('User is already blocked')
        }

        if (user.role == 'admin') {
            return res.status(422).send('Cannot block an admin');
        }

        user.isBlocked = true;
        await user.save();

        res.status(200).send('User blocked successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error blocking user');
    }
});

//route to unblock a user
router.put('/unblock/:userId', authenticateToken, authenticateAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        if (user.isBlocked == false) {
            return res.status(422).send('User is already unblocked')
        }

        user.isBlocked = false;
        await user.save();

        res.status(200).send('User unblocked successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error unblocking user');
    }
});

//list all Blog Posts
router.get('/blogPosts', authenticateToken, authenticateAdmin, async (req, res) => {
    try {
        const blogPosts = await Blog.find({}, 'title owner createdAt averageRating isVisible');//second parameter is the projection
        res.status(200).json(blogPosts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving blog posts');
    }
});

//view a Particular Blog Post (no restriction on isVisible)
router.get('/blogPosts/:blogId', authenticateToken, authenticateAdmin, async (req, res) => {
    try {
        const blogPost = await Blog.findById(req.params.blogId);
        if (!blogPost) {
            return res.status(404).send('Blog post not found');
        }

        //send blog post in JSON form
        res.status(200).json(blogPost);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving blog post');
    }
});

//disable a blog, wont be visible to users.
router.put('/disableBlog/:blogId', authenticateToken, authenticateAdmin, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.blogId);
        if (!blog) {
            return res.status(404).send('Blog post not found');
        }

        if (blog.isVisible == false) {
            return res.status(422).send('Blog post is already disabled')
        }

        blog.isVisible = false;
        await blog.save();

        res.status(200).send('Blog post hidden successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error hiding blog post');
    }
});

//enable a blog to be visible to users again.
router.put('/enableBlog/:blogId', authenticateToken, authenticateAdmin, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.blogId);
        if (!blog) {
            return res.status(404).send('Blog post not found');
        }

        if (blog.isVisible) {
            return res.status(422).send('Blog post is already enabled')
        }

        blog.isVisible = true;
        await blog.save();

        res.status(200).send('Blog post enabled & made visible successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error in making blog post enabled');
    }
});

module.exports = router;
