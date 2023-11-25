const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const User = require('../models/User');

//endpoint to search for blog posts
router.get('/', async (req, res) => {
    try {
        const { keywords, author, sortBy, sortOrder, page = 1, limit = 10 } = req.query;

        //if there are no query parameters
        if (!keywords && !author && !sortBy && !sortOrder) {
            return res.status(400).json({ error: 'No search parameters provided' });
        }

        //query object 
        const query = {};

        // if keywords is provided and is as an array
        if (Array.isArray(keywords) && keywords.length > 0) {
            query.$or = keywords.map(keyword => ({  //$or in mongodb: an array of conditions that are combined with OR
                $or: [ //another OR object checking the keyword in title OR content
                    { title: { $regex: new RegExp(keyword, 'i') } }, //i flag=case insesnitive
                    { content: { $regex: new RegExp(keyword, 'i') } },
                ],
            }));
        }

        //if author is provided (as an ID)
        // if (author) {
        //     query.owner = author; //'author' is the ID of the author
        // }

        query.isVisible = true; //only find blog posts that are not hidden

        //---Sorting implementation---
        const sortOptions = {};//empty js object
        const validSortOptions = ['title', 'averageRating', 'createdAt']; //it can be sorted asc/desc based on these

        //if sortBy is truthy value & one of the valid options
        if (sortBy && validSortOptions.includes(sortBy)) {
            let sortvalue;
            // -1 indicates descending, else ascending
            if (!sortOrder) {
                sortvalue = 1;//asc default
            } else if (sortOrder === 'desc') {
                sortvalue = -1;
            } else {
                sortvalue = 1;
            }
            sortOptions[sortBy] = sortvalue; //setting attribute of sortOptions object, for example { title: 1 }, acts as mongodb query
        }
        
        let searchResults = await Blog.find(query).sort(sortOptions).exec();

        searchResults = await Promise.all(searchResults.map(async blog => {
            const user = await User.findById(blog.owner);
            if (user) {
                blog = blog.toObject();
                blog.owner = user.username; //replace for display purposes
            }
            return blog;
        }));

        // if author query parameter is provided, filter blogs
        if (author) {
            searchResults = searchResults.filter(blog => blog.owner.includes(author));
        }

        // implement pagination
        const start = (page - 1) * limit;
        const end = start + limit;
        searchResults = searchResults.slice(start, end);

        ///-----------------

        const blogNo = await Blog.find(query).countDocuments(); //counting no. of blogs in db
        const totalPages = Math.ceil(blogNo / limit); //total no. of pages,default 10

        return res.status(200).json({ blogs: searchResults, totalPages }); //sending search results
    } catch (error) {
        console.error(error);
        res.status(500).send('Error searching for blog posts');
    }
});

module.exports = router;
