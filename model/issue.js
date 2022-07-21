const mongoose = require('mongoose')

const IssueScheme = new mongoose.Schema({
  issue_title: String,
  issue_text: String,
  created_by: String,
  created_on: {
    type: Date,
    default: Date.now
  },
  updated_on: {
    type: Date,
    default: Date.now
  },
  assigned_to: {
    type: String,
    default: ""
  },
  open: {
    type: Boolean,
    default: true
  },
  status_text: {
    type: String,
    default: ""
  }
},{
  versionKey: false
})

module.exports = mongoose.model('Issue', IssueScheme)