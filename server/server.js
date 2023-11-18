const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors= require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

//importing routes
const userRoutes = require('./routes/userModuleRoutes');
const blogRoutes = require('./routes/blogPostRoutes');
const userInteractionRoutes = require('./routes/userInteractionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const searchRoutes = require('./routes/searchRoutes');

//portt
const port = 3000;

//DB connection
mongoose.connect('mongodb://localhost:27017/blogDB');

//Routes for user module
app.use('/users', userRoutes);

//Routes for blog post management
app.use('/blogs', blogRoutes);

//Routes for user interaction
app.use('/interaction', userInteractionRoutes);

//Routes for admin
app.use('/admin', adminRoutes);

//Routes for search
app.use('/search', searchRoutes);

app.listen(port, () => {
  console.log("Server is running, Listening on port " + port);
});
