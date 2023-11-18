const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken'); //middleware to authenticate user.
const Blog = require('../models/Blog');
const Notification = require('../models/Notification');
const User = require('../models/User');

//Create a new blog post
router.post('/new', authenticateToken, async (req, res) => {
  try {

    const newBlog = new Blog({
      title: req.body.title,
      content: req.body.content,
      owner: req.user.id //assigning owner (req.user will be assigned in auethenticate token)
    });

    const savedBlog = await newBlog.save();
    res.status(200).send('Blog post was uploaded!');
  } catch (error) {
    console.log("ERROR \n ************ \n" + error);
    res.status(500).send('Error creating a new blog post');
  }
});

//retrieve a list of all blog posts with pagination and filtering
router.get('/', async (req, res) => {
  try {
    let titleProvided = true;
    const query = {}; //forming mongodb query

    const { page = 1, limit = 10, sortBy, sortOrder, title, minRating, maxRating } = req.query;//info is sent in query parameters
    //default values=page 1, limit=10 per page

    const totalRecords = await Blog.countDocuments();
    if (page && (page < 1 || (page - 1) * limit > totalRecords)) { //request violates field constraints, no.of items to skip over>total records
      res.status(422).send('Illegal value of page encountered');
    }
    if (limit && (limit < 5 || limit > 100)) {
      res.status(422).send('Illegal value of limit encountered');
    }

    if (minRating && !isNaN(minRating)) {
      //creating averagerating property
      query.averageRating = { $gte: Number(minRating) }; //mongodb query operator for >=
    }

    if (maxRating && !isNaN(maxRating)) {
      //add on the existing avg rating condition
      query.averageRating = { ...query.averageRating, $lte: Number(maxRating) }; //mongodb operator for <= 
      //if this runs, in the end query will look like: { averageRating: { $gte: 3, $lte: 5 } }
    }

    query.isVisible = true; //only display blog posts which are visible

    if (title) {
      //only assign, if not null
      query.title = { $regex: new RegExp(title, 'i') }; //regex allows to match the title, if provided in search
    } else {
      titleProvided = false;
    }

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

    // console.log(" * * * * * * * * * QUERY * * * * * * *  * *");
    // console.log(query);

    //find blogs which match
    //use "await" to make sure whole query executes before assigning
    const blogs = await Blog.find(query)
      .sort(sortOptions) //sort object
      .skip((page - 1) * limit) //implements pagination by skipping over objects 
      .limit(limit)
      .exec();

    if (blogs.length === 0) {
      return res.status(404).send('No blogs found');
    }

    res.status(200).json(blogs); //send blogs (postS)in response.

  } catch (error) {
    console.log("ERROR \n ************ \n" + error);
    res.status(500).send('Error retrieving blog posts');
  }
});

//get a specific blog post by ID
router.get('/:blogId', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).send('Blog post not found');
    }
    //incase of success
    res.status(200).json(blog);
  } catch (error) {
    console.log("ERROR \n ************ \n" + error);
    res.status(500).send('Error retrieving the blog post');
  }
});

//update a blog post (only the owner can update)
router.put('/:blogId', authenticateToken, async (req, res) => {
  try {
    if (!req.params.blogId) {
      //unprocessable entity!!
      return res.status(422).send('No blog ID was sent');
    }
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).send('Blog post not found');
    }

    //attempt to edit but it's not the owner (req.user set in authenticatetoken middlewar)
    if (blog.owner.toString() !== req.user.id) {
      return res.status(403).send('Permission denied');
    }

    //setting attributes of blog object , if provided (truthy value)
    if (req.body.title) {
      blog.title = req.body.title;
    }

    if (req.body.content) {
      blog.content = req.body.content;
    }

    const updatedBlog = await blog.save();
    res.status(200).send('Blog post updated successfully')
  } catch (error) {
    console.log("ERROR IN Put Blogid\n ************ \n" + error);
    res.status(500).send('Error updating the blog post');
  }
});

//Delete a blog post (only the owner can delete)
router.delete('/:blogId', authenticateToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {//blog is undefined, null, or some other falsy value
      return res.status(404).send('Blog post not found');//wrong id
    }

    //attempt to delete but it's not the owner
    if (blog.owner.toString() !== req.user.id) {
      return res.status(403).send('Permission denied');
    }

    await Blog.deleteOne({ id: req.params.blogId });//mongo query to delete

    res.status(200).send('Blog post deleted successfully');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error deleting the blog post');
  }
});

//rate blog post
router.post('/rate/:blogId', authenticateToken, async (req, res) => {
  try {
    //find blog in db
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).send('Blog post not found');//not found error status
    }

    if (!req.body.rating) {
      return res.status(400).send('Rating not found');//status 400 for malformed request syntax
    }

    //cannot rate ur own post
    if (blog.owner.toString() == req.user.id) {
      return res.status(403).send('Cannot rate your own post');//permission denied code
    }

    //assuming rating is a number between 1 and 5
    const rating = parseInt(req.body.rating);

    //invalid rating values
    if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
      return res.status(400).send('Invalid rating'); //status 400 for malformed request syntax
    }

    //if the user has already rated this blog
    const existingRatingIndex = blog.ratings.findIndex( //Returns the index of the first element in the array where predicate is true
      (rating) => rating.user.toString() === req.user.id
    );

    // If the user has already rated, update their rating
    if (existingRatingIndex !== -1) {
      blog.ratings[existingRatingIndex].value = rating; //assign value which was gotten from reqbody
    } else { //index -1, the user hasn't rated

      //create new rating
      const newRating = {
        user: req.user.id,
        value: rating //assign value gotten from reqbody
      };

      //adding object to array
      blog.ratings.push(newRating);
    }

    //Recalculate the average
    const callbackFunc = (acc, rating) => acc + rating.value; //for reduce func, accumulate sum
    let sum = blog.ratings.reduce(callbackFunc, 0); //reduce array to one value,i.e. sum of ratings; 0 is inital value(accumulator)
    blog.averageRating = (sum / blog.ratings.length); //assign new value to sum

    //save in db
    await blog.save();

    //success!!
    if (existingRatingIndex !== -1) {
      res.status(200).send('Your previous rating was updated successfully')
    } else {
      res.status(200).send('Your rating was added successfully');
    }
  }
  catch (error) {
    console.log(error);
    res.status(500).send('Error rating the blog post');
  }
});

//endpoint to comment on a blog post
router.post('/comment/:blogId', authenticateToken, async (req, res) => {
  try {
    if (!req.params.blogId) {
      return res.status(400).send('No blog ID was sent'); //malformed request
    }

    //for invalid comment values
    if (!req.body || !req.body.text || req.body.text == "") {
      return res.status(400).send('No comment data was sent'); //malformed request
    }
    //get blog from db
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).send('Blog post not found');
    }

    //creating comment obj
    const newComment = {
      user: req.user.id,
      text: req.body.text,
    };

    blog.comments.push(newComment); //updating the blog object

    //new comment notification
    //console.log("req user "+req.user.id);
    let commentorName = req.user.username;
    let notifString = commentorName + " just commented on your post! ";

    //notif object
    const notification = new Notification({
      user: blog.owner,
      type: 'comment',
      details: {
        blogId: blog._id,
        commenter: req.user._id,
      },
      notifText: notifString,
    });

    const blogOwner = await User.findById(blog.owner);
    if (blogOwner) {
      blogOwner.notifications.push(notification);
      await blogOwner.save();
    }

    //saving in dbs
    await notification.save();
    await blog.save();

    //success
    res.status(200).send('Commented successfully');
  }
  catch (error) {
    console.log(error);
    res.status(500).send('Error commenting on the blog post'); //status code for internal server error
  }
});

module.exports = router;
