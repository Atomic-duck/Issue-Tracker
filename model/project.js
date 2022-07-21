const mongoose = require('mongoose')
const { Schema } = mongoose;

const ProjectScheme = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  issues: [{ type: Schema.Types.ObjectId, ref: 'Issue' }]
},{
  versionKey: false
})

module.exports = mongoose.model('Project', ProjectScheme)