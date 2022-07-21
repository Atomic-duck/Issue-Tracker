const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let id1
let id2

suite('Functional Tests', function() {
  suite('Post test', function(){
    test('Create an issue with every field', function(done){
      chai.request(server)
          .post('/api/issues/apitest')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({
            'issue_title': 'qwe',
            'issue_text': 'qwe',
            'created_by': 'qwe',
            'assigned_to': 'qwe',
            'status_text': 'qwe'
          })
          .end(function(err, res){
            id1 = res.body._id
            assert.equal(res.body.issue_title, 'qwe')
            assert.equal(res.body.issue_text, 'qwe')
            assert.equal(res.body.created_by, 'qwe')
            assert.equal(res.body.assigned_to, 'qwe')
            assert.equal(res.body.status_text, 'qwe')
            assert.equal(res.body.open, true)
            done()
          })
    })

    test('Create an issue with only required fields', function(done){
      chai.request(server)
          .post('/api/issues/apitest')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({
            'issue_title': 'qwe',
            'issue_text': 'qwe',
            'created_by': 'qwe',
          })
          .end(function(err, res){
            id2 = res.body._id
            assert.equal(res.body.issue_title, 'qwe')
            assert.equal(res.body.issue_text, 'qwe')
            assert.equal(res.body.created_by, 'qwe')
            assert.equal(res.body.assigned_to, '')
            assert.equal(res.body.status_text, '')
            assert.equal(res.body.open, true)
            done()
          })
    })

    test('Create an issue with missing required fields', function(done){
      chai.request(server)
          .post('/api/issues/apitest')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({
            'issue_title': 'qwe',
          })
          .end(function(err, res){
            assert.equal(res.body.error, 'required field(s) missing')
            done()
          })
    })
  })

  suite('Get test', function(){
    test('View issues on a project', function(done){
      chai.request(server)
          .get('/api/issues/apitest')
          .end(function(err, res){
            assert.isArray(res.body)
            for(let issue of res.body){
              assert.property(issue, 'issue_title');
              assert.property(issue, 'issue_text');
              assert.property(issue, 'created_by');
              assert.property(issue, 'assigned_to');
              assert.property(issue, 'status_text');
              assert.property(issue, 'open');
              assert.property(issue, 'created_on');
              assert.property(issue, 'updated_on');
              assert.property(issue, '_id');
            }
            done()
          })
    })

    test('View issues on a project with one filter', function(done){
      chai.request(server)
          .get('/api/issues/apitest?open=false')
          .end(function(err, res){
            assert.isArray(res.body)
            for(let issue of res.body){
              assert.equal(issue.open, false);
              assert.property(issue, 'issue_title');
              assert.property(issue, 'issue_text');
              assert.property(issue, 'created_by');
              assert.property(issue, 'assigned_to');
              assert.property(issue, 'status_text');
              assert.property(issue, 'open');
              assert.property(issue, 'created_on');
              assert.property(issue, 'updated_on');
              assert.property(issue, '_id');
            }
            done()
          })
    })

    test('View issues on a project with one filter', function(done){
      chai.request(server)
          .get('/api/issues/apitest?open=false&assigned_to=Joe')
          .end(function(err, res){
            assert.isArray(res.body)
            for(let issue of res.body){
              assert.equal(issue.open, false);
              assert.equal(issue.assigned_to, 'Joe');
              assert.property(issue, 'issue_title');
              assert.property(issue, 'issue_text');
              assert.property(issue, 'created_by');
              assert.property(issue, 'assigned_to');
              assert.property(issue, 'status_text');
              assert.property(issue, 'open');
              assert.property(issue, 'created_on');
              assert.property(issue, 'updated_on');
              assert.property(issue, '_id');
            }
            done()
          })
    })
  })

  suite('Update test',function(){
    test('Update one field on an issue',function(done){
      chai.request(server)
          .put('/api/issues/apitest')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({
            '_id': id1,
            'issue_text': 'aaa',
          })
          .end(function(err, res){
            assert.equal(res.body.result, 'successfully updated')
            assert.equal(res.body._id, id1)
            done()
          })
    })

    test('Update multiple fields on an issue',function(done){
      chai.request(server)
          .put('/api/issues/apitest')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({
            '_id': id2,
            'issue_text': 'no name',
            'created_by': 'me'
          })
          .end(function(err, res){
            assert.equal(res.body.result, 'successfully updated')
            assert.equal(res.body._id, id2)
            done()
          })
    })

    test('Update an issue with missing _id',function(done){
      chai.request(server)
          .put('/api/issues/apitest')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({
            'issue_text': 'no name',
            'created_by': 'me'
          })
          .end(function(err, res){
            assert.equal(res.body.error, 'missing _id')
            done()
          })
    })

    test('Update an issue with no fields to update',function(done){
      chai.request(server)
          .put('/api/issues/apitest')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({
            '_id': id1
          })
          .end(function(err, res){
            assert.equal(res.body.error, 'no update field(s) sent')
            assert.equal(res.body._id, id1)
            done()
          })
    })

    test('Update an issue with an invalid _id',function(done){
      chai.request(server)
          .put('/api/issues/apitest')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({
            '_id': 'aaaaaa',
            'issue_text': 'no name'
          })
          .end(function(err, res){
            assert.equal(res.body.error, 'could not update')
            assert.equal(res.body._id, 'aaaaaa')
            done()
          })
    })
  })

  suite('Delete test',function(){
    test('Delete an issue',function(done){
      chai.request(server)
          .delete('/api/issues/apitest')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({
            _id: id1
          })
          .end(function(err, res){
            assert.equal(res.body.result, 'successfully deleted')
            assert.equal(res.body._id, id1)
            done()
          })
    })

    test('Delete an issue with an invalid _id',function(done){
      chai.request(server)
          .delete('/api/issues/apitest')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({
            _id: 'aaaa'
          })
          .end(function(err, res){
            assert.equal(res.body.error, 'could not delete')
            assert.equal(res.body._id, 'aaaa')
            done()
          })
    })

    test('Delete an issue with missing _id',function(done){
      chai.request(server)
          .delete('/api/issues/apitest')
          .end(function(err, res){
            assert.equal(res.body.error, 'missing _id')
            done()
          })
    })
  })
});
