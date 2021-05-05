import 'mocha';
import { expect } from 'chai';
import * as request from 'supertest';
import * as mongoose from 'mongoose';

import app from '../../../app';
import setupDB from '../../../setup/mongoose';

describe('Upcomings:', () => {
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
        .get('/api/upcomings/invalid')
        .expect(400);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('Invalid request parameter sent');
    });
  });

  describe('#POST', () => {
    it('does not create new upcoming: date missing', async () => {
      const res = await request(app)
        .post('/api/upcomings')
        .send({ title: 'Physics' })
        .expect(400);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('\'date\' is required');
    });

    it('does not create new upcoming: title missing', async () => {
      const res = await request(app)
        .post('/api/upcomings')
        .send({ date: new Date().toISOString() })
        .expect(400);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('\'title\' is required');
    });

    it('does not create new upcoming: invalid date', async () => {
      const res = await request(app)
        .post('/api/upcomings')
        .send({ title: 'Physics', date: 'not a date' })
        .expect(400);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('\'date\' invalid date sent');
    });

    it('create new upcoming successfully', async () => {
      const res = await request(app)
        .post('/api/upcomings')
        .send({ title: 'Physics', date: new Date().toISOString() })
        .expect(200);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('Upcoming created successfully');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.be.an('object');
      expect(res.body.data).to.have.property('title');
      expect(res.body.data.title).to.eql('Physics');

      const res2 = await request(app)
        .get('/api/upcomings')
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
    it('cannot update upcoming: not found', async () => {
      const res = await request(app)
        .put('/api/upcomings/607708e2658374819c03f843')
        .expect(404);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('Upcoming not found');
    });

    it('updates upcoming successfully', async () => {
      const res = await request(app)
        .post('/api/upcomings/')
        .send({ title: 'Physics', date: new Date().toISOString() })
        .expect(200);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('Upcoming created successfully');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.be.an('object');
      expect(res.body.data).to.have.property('title');
      expect(res.body.data.title).to.eql('Physics');

      const res2 = await request(app)
        .put(`/api/upcomings/${res.body.data.id}`)
        .expect(200);

      expect(res2.body).to.not.be.empty;
      expect(res2.body).to.be.an('object');
      expect(res2.body).to.have.property('message');
      expect(res2.body.message).to.eql('Upcoming updated successfully');
    });
  });

  describe('#DELETE', () => {
    it('cannot delete upcoming: not found', async () => {
      const res = await request(app)
        .delete('/api/upcomings/607708e2658374819c03f843')
        .expect(404);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('Upcoming not found');
    });

    it('deletes upcoming successfully', async () => {
      const res = await request(app)
        .post('/api/upcomings/')
        .send({ title: 'Physics', date: new Date().toISOString() })
        .expect(200);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('Upcoming created successfully');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.be.an('object');
      expect(res.body.data).to.have.property('title');
      expect(res.body.data.title).to.eql('Physics');

      const res2 = await request(app)
        .delete(`/api/upcomings/${res.body.data.id}`)
        .expect(200);

      expect(res2.body).to.not.be.empty;
      expect(res2.body).to.be.an('object');
      expect(res2.body).to.have.property('message');
      expect(res2.body.message).to.eql('Upcoming deleted successfully');
    });
  });
});
