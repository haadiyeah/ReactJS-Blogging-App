const mongoose = require('mongoose');
const User = require('./User');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',//foreign key
    required: true,
  },
  ratings: {
    type: [ ///array of objects containing corresponding user and rating
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        value: {
          type: Number,
          required: true,
        },
      },
    ],
    default: [],//empty array default
  },

  averageRating: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
    },
  ],
  isVisible: { //admin can change this property only
    type: Boolean,
    default: true,
  },
  categories: {
    type: [String],
    default: []
  },
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
