const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

//endpoint to search for blog posts
router.get('/', async (req, res) => {
    try {
        const { keywords, author, sortBy, sortOrder } = req.query;

        //if there are no query parameters
        if (!keywords && !author) {
            return res.status(400).json({ error: 'No search parameters provided' });
        }

        //query object 
        const query = {};

        //if keywords is provided and is as an array
        if (Array.isArray(keywords) && keywords.length > 0) {
            query.$or = keywords.map(keyword => ({  //$or in mongodb: an array of conditions that are combined with OR
                $or: [ //another OR object checking the keyword in title OR content
                    { title: { $regex: new RegExp(keyword, 'i') } },
                    { content: { $regex: new RegExp(keyword, 'i') } },
                ],
            }));
        }

        //if author is provided (as an ID)
        if (author) {
            query.owner = author; //'author' is the ID of the author
        }

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

        // Execute the search with sorting
        let searchResults = await Blog.find(query)
            .sort(sortOptions)
            .exec();

        if (searchResults.length == 0) {
            res.status(404).send('No corresponding blog posts found');
        }

        res.status(200).json(searchResults); //sending search results
    } catch (error) {
        console.error(error);
        res.status(500).send('Error searching for blog posts');
    }
});

module.exports = router;
