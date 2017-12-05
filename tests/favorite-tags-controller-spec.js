const chai = require('chai');
const { assert, expect } = chai;
const nock = require('nock');
const mongoose = require('mongoose');
const _ = require('underscore');

const chaiHttp = require('chai-http');
chai.use(require('chai-http'));
const index = require('../app');
const User = mongoose.model('User');
let token = null;
const headerObj = {
    "typ": "JWT",
    "alg": "HS256"
}
const requestObj = {user: {favoriteTags: ['dogs', 'education']}}

describe('FavoriteTag Feature', () => {
  var newuser = {}
  before(() => {
    return User.find({ email: 'jane2ty1232qw@gmail.com'}).remove().exec()
    .then(function() {
      var user = new User();
      user.username = 'janewq2tg1231';
      user.email = 'jane2ty1232qw@gmail.com';
      user.setPassword('jane2122qw');
      return user.save().then(function(){
        newuser = {user: user.toAuthJSON()};
        token = "Bearer " + newuser.user.token
      })
    })
  })

  describe('User Edit Function', () => {
    it('should return an error message when the user is not logged in', (done) => {
      nock('/api')
        .put(`/user`, ['dogs', 'education'])
        .reply(401);
      chai.request(index)
        .put('/api/user')
        .send()
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('should update the user object with the favaorite tags when the user is logged in', (done) => {      
      nock('/api', {
          reqheaders: {
            'Authorization': token,
            header: headerObj
          }
        })
        .put(`/user`,  requestObj)
        .reply(200);
      chai.request(index)
        .put('/api/user')
        .set('Authorization', token)
        .set('header', headerObj)
        .send(requestObj)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
  describe('Favorite Controller', () => {
    describe('Get Function', () => {
      it('should not return the user favorite tags when the user is not logged in', (done) => {    
        nock('/api')
        .get(`/favoriteTags`)
        .reply(200);
        chai.request(index)
          .get('/api/favoriteTags')
          .set('Accept', 'application/json')
          .end((err, res) => {
            expect(res).to.have.status(401);
            done();
          });
      })
      it('should return the user favorite tags when the user is logged in', (done) => {    
        nock('/api', {
          reqheaders: {
            'Authorization': token,
            header: headerObj
          }
        })
        .get(`/favoriteTags`)
        .reply(200);
        chai.request(index)
          .get('/api/favoriteTags')
          .set('Authorization', token)
          .set('header', headerObj)
          .set('Accept', 'application/json')
          .end((err, res) => {
            let favoriteTagsArray = []
            _.map(res.body.favoriteTags, (favoriteTag) => {
              favoriteTagsArray.push(favoriteTag.favoriteTag)
            })
            expect(res).to.have.status(200);
            assert.deepEqual(favoriteTagsArray,[ 'dogs', 'education' ])
            done();
          });
      })
    })
  })
});
