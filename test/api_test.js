'use strict';

var chai = require('chai');
var chaihttp = require('chai-http');
var fs = require('fs');

var server = 'http://localhost:' + (process.env.PORT || 3000);
var expect = chai.expect;
var dir = __dirname + '/../data';

require('../server.js');
chai.use(chaihttp);

describe('Simple JSON database', function() {
  it('should post JSON data to file1', function(done) {
    chai.request(server).
      post('/file1').
      send({message: 'hello world'}).
      end(function(err, res) {
        expect(err).equals(null);
        expect(res).to.be.a('object');
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should make another post to file2', function(done) {
    chai.request(server).
      post('/file2').
      send({msg: 'foo', code: 47}).
      end(function(err, res) {
        expect(err).equals(null);
        expect(res).to.be.a('object');
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should get JSON data from file1', function(done) {
    chai.request(server).
      get('/file1').
      end(function(err, res) {
        expect(err).equals(null);
        expect(res).to.be.a('object');
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).equals('hello world');
        done();
      });
  });

  it('should get JSON data from file2', function(done) {
    chai.request(server).
      get('/file2').
      end(function(err, res) {
        expect(err).equals(null);
        expect(res).to.be.a('object');
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.be.a('string');
        expect(res.body.msg).equals('foo');
        expect(res.body).to.have.property('code');
        expect(res.body.code).to.be.a('number');
        expect(res.body.code).equals(47);
        done();
      });
  });

  it('should post JSON data to existing file1', function(done) {
    chai.request(server).
      post('/file1').
      send({message: 'foo bar'}).
      end(function(err, res) {
        expect(err).equals(null);
        expect(res).to.be.a('object');
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should get JSON data from updated file1', function(done) {
    chai.request(server).
      get('/file1').
      end(function(err, res) {
        expect(err).equals(null);
        expect(res).to.be.a('object');
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).equals('foo bar');
        done();
      });
  });

  it('should return error when failed to save the post', function(done) {
    fs.unlink(dir + '/file1.json', function(err) {
      expect(err).equals(null);

      fs.unlink(dir + '/file2.json', function(err) {
        expect(err).equals(null);

        fs.rmdir(dir, function(err) {
          expect(err).equals(null);

          fs.writeFile(dir, 'foo', function(err) {
            expect(err).equals(null);

            chai.request(server).
              post('/file1').
              send({message: 'hello world'}).
              end(function(err, res) {
                expect(err).equals(null);
                expect(res).to.be.a('object');
                expect(res).to.have.status(500);
                done();
              });
          });
        });
      });
    });
  });

  it('returns false success when the file is not found', function(done) {
    fs.unlink(dir, function(err) {
      expect(err).equals(null);

      chai.request(server).
        get('/file1').
        end(function(err, res) {
          expect(err).equals(null);
          expect(res).to.be.a('object');
          expect(res).to.have.status(204);
          done();
        });
    });
  });
});
