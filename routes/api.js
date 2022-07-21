'use strict';
const Project = require('../model/project.js')
const Issue = require('../model/issue.js')
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      let projectName = req.params.project;
      let {_id} = req.query
 // console.log(req.query)
      
      if(_id){
        const issue = await Issue.findById(_id)
        if(!issue) return res.json([])
        
        for(let p in req.query){
          if(issue[p] != req.query[p]) return res.json([])
        }
        return res.json([issue])
      }
      
      // const project = await Project.findOne({name: projectName})
      // if(project == null) return res.json([])
      
      // let issues = await Promise.all(project.issues.map(async id=>{
      //   let filter = req.query
      //   filter._id = id
      //   let issue = await Issue.findOne(filter).populate()
      //   return issue
      // }))

      const project = await Project.findOne({name: projectName}).populate('issues')
      if(project == null) return res.json([])
      
      const issues = project.issues.filter(issue=>{
        for(let p in req.query){
          if(issue[p] != req.query[p]) return false
        }
        return true
      })
// console.log(issues)
      res.json(issues)
    })
    
    .post(async function (req, res){
      let projectName = req.params.project;
      const {issue_title,
             issue_text,
             created_by,
             assigned_to,
             status_text} = req.body

      const issue = await Issue.create({
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      })

      if(!issue_title || !issue_text || !created_by){
        return res.json({ error: 'required field(s) missing' })
      }

      await Project.findOneAndUpdate({name:projectName},{
        $push: {issues: issue._id}
      },{
        upsert: true
      })
      
      res.json(issue)
    })
    
    .put(async function (req, res){
      let flag = true
      let {_id} = req.body
      let update = {}

      if(!_id) return res.json({ error: 'missing _id' })
      for(let p in req.body){
        if(p != '_id' && req.body[p] != ''){
          flag = false
          update[p] = req.body[p]
        }
      }
      if(flag) return res.json({ error: 'no update field(s) sent', '_id': _id })
      if(!ObjectId.isValid(_id)){
        return res.json({ error: 'could not update', '_id': _id })
      }
      
      update.updated_on = new Date()
      const mess = await Issue.updateOne({_id},{
        $set: update
      })

      if(mess.modifiedCount == 0) return res.json({ error: 'could not update', '_id': _id })
      res.json({result: 'successfully updated', '_id': _id })
    })
    
    .delete(async function (req, res){
      let {_id} = req.body

      if(!_id) return res.json({ error: 'missing _id' })
      if(!ObjectId.isValid(_id)){
        return res.json({ error: 'could not delete', '_id': _id})
      }
      
      const issue = await Issue.findByIdAndDelete(_id)
      if(!issue) return res.json({ error: 'could not delete', '_id': _id })
      
      res.json({ result: 'successfully deleted', '_id': _id })
    });
    
};
