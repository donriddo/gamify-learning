import 'mocha';
import { expect } from 'chai';
import * as request from 'supertest';
import * as mongoose from 'mongoose';

import app from '../../../app';
import setupDB from '../../../setup/mongoose';

describe('Assignments:', () => {
  beforeEach(async () => {
    try {
      await setupDB('mongodb://localhost/gamify_learning_test');
    } catch (error) {
      console.log('Error setting up: ', error);
    }
  });

  afterEach(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.dropDatabase();
      await mongoose.disconnect();
    }
  });

  describe('#GENERAL', () => {
    it('400: invalid ObjectID', async () => {
      const res = await request(app)
        .get('/api/assignments/invalid')
        .expect(400);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('Invalid request parameter sent');
    });
  });

  describe('#POST', () => {
    it('does not create new assignment: date missing', async () => {
      const res = await request(app)
        .post('/api/assignments')
        .send({ title: 'Physics' })
        .expect(400);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('\'date\' is required');
    });

    it('does not create new assignment: title missing', async () => {
      const res = await request(app)
        .post('/api/assignments')
        .send({ date: new Date().toISOString() })
        .expect(400);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('\'title\' is required');
    });

    it('does not create new assignment: invalid date', async () => {
      const res = await request(app)
        .post('/api/assignments')
        .send({ title: 'Physics', date: 'not a date' })
        .expect(400);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('\'date\' invalid date sent');
    });

    it('create new assignment successfully', async () => {
      const res = await request(app)
        .post('/api/assignments')
        .send({ title: 'Physics', date: new Date().toISOString() })
        .expect(200);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('Assignment created successfully');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.be.an('object');
      expect(res.body.data).to.have.property('title');
      expect(res.body.data.title).to.eql('Physics');

      const res2 = await request(app)
        .get('/api/assignments')
        .expect(200);

      expect(res2.body.data).to.not.be.empty;
      expect(res2.body.data).to.be.an('array');
      expect(res2.body.data.length).to.eql(1);
      expect(res2.body.data[0]).to.be.an('object');
      expect(res2.body.data[0]).to.have.property('title');
      expect(res2.body.data[0].title).to.eql('Physics');
    });
  });

  describe('#PUT', () => {
    it('cannot update assignment: not found', async () => {
      const res = await request(app)
        .put('/api/assignments/607708e2658374819c03f843')
        .expect(404);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('Assignment not found');
    });

    it('updates assignment successfully', async () => {
      const res = await request(app)
        .post('/api/assignments/')
        .send({ title: 'Physics', date: new Date().toISOString() })
        .expect(200);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('Assignment created successfully');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.be.an('object');
      expect(res.body.data).to.have.property('title');
      expect(res.body.data.title).to.eql('Physics');

      const res2 = await request(app)
        .put(`/api/assignments/${res.body.data.id}`)
        .expect(200);

      expect(res2.body).to.not.be.empty;
      expect(res2.body).to.be.an('object');
      expect(res2.body).to.have.property('message');
      expect(res2.body.message).to.eql('Assignment updated successfully');
    });
  });

  describe('#DELETE', () => {
    it('cannot delete assignment: not found', async () => {
      const res = await request(app)
        .delete('/api/assignments/607708e2658374819c03f843')
        .expect(404);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('Assignment not found');
    });

    it('deletes assignment successfully', async () => {
      const res = await request(app)
        .post('/api/assignments/')
        .send({ title: 'Physics', date: new Date().toISOString() })
        .expect(200);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('Assignment created successfully');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.be.an('object');
      expect(res.body.data).to.have.property('title');
      expect(res.body.data.title).to.eql('Physics');

      const res2 = await request(app)
        .delete(`/api/assignments/${res.body.data.id}`)
        .expect(200);

      expect(res2.body).to.not.be.empty;
      expect(res2.body).to.be.an('object');
      expect(res2.body).to.have.property('message');
      expect(res2.body.message).to.eql('Assignment deleted successfully');
    });
  });
});
