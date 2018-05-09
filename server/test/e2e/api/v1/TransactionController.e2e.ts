import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as supertest from 'supertest';
import { ISqlQuery, DataService } from '../../../../src/datasource/DataService';
import { Item } from '../../../../src/domain/items/models/Item';
import { IResponseMessage } from '../../../../src/utils/responseHandler/ResponseHandler';
import * as unit from 'ethereumjs-units';

chai.use(chaiAsPromised);
const expect = chai.expect;

process.env.PGHOST = 'localhost';
process.env.PGPORT = '5435';
process.env.PGUSER = 'local_user';
process.env.PGPASSWORD = 'local_pass';
process.env.PGDATABASE = 'local_puma_poc';

const server = supertest.agent('http://localhost:8080/');
const endpoint = 'api/v1/transaction';
const networkid = 3; //3 – ropsten, 1- mainnet
const testItem: Item = require('../../../../resources/testData.json').testItem;

const dataservice = new DataService();
const insertTestData = async () => {
  const sqlQuery: ISqlQuery = {
    text: `INSERT INTO items("itemID", "ownerID", title, description, 
        price, size, licence, "itemUrl", tags, rating, "uploadedDate")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
        `,
    values: [
      testItem.itemID,
      testItem.ownerID,
      testItem.title,
      testItem.description,
      testItem.price,
      testItem.size,
      testItem.licence,
      testItem.itemUrl,
      testItem.tags,
      testItem.rating,
      testItem.uploadedDate
    ]
  };

  await dataservice.executeQueryAsPromise(sqlQuery);
};
const sessionID = '000001';
const initiateSession = async () => {
  const sqlQuery: ISqlQuery = {
    text: 'INSERT INTO sessions("sessionID", status) VALUES($1, $2);',
    values: [sessionID, -1]
  }

  await dataservice.executeQueryAsPromise(sqlQuery);
};

const deleteTestData = async () => {
  const sqlQuery: ISqlQuery = {
    text: `DELETE FROM items WHERE "itemID" = $1`,
    values: [testItem.itemID]
  };

  await dataservice.executeQueryAsPromise(sqlQuery);
};

const deleteSession = async () => {
  const sqlQuery: ISqlQuery = {
    text: 'DELETE FROM sessions WHERE "sessionID" = $1;',
    values: [sessionID]
  }

  await dataservice.executeQueryAsPromise(sqlQuery);
};

describe('A TransactionController', () => {
  describe('with correct data', () => {
    beforeEach(async () => {
      await insertTestData();
    });
    afterEach(async () => {
      await deleteTestData();
    });

    it('should initiate a session with random ID', (done) => {
      const expectedResponse: IResponseMessage = {
        success: true,
        status: 'OK',
        message: 'SQL Query completed successful.',
        data: []
      }

      server.get(`${endpoint}/init`)
        .expect(200)
        .end((err: Error, res: any) => {
          const body = res.body;
          expect(body).to.have.property('success').that.is.equal(expectedResponse.success);
          expect(body).to.have.property('status').that.is.equal(expectedResponse.status);
          expect(body).to.have.property('message').that.is.equal(expectedResponse.message);
          expect(body).to.have.property('data').to.be.an('array');
          expect(body.data[0]).to.have.property('sessionID');
          expect(body.data[0]).to.have.property('txHash').that.is.equal(null);
          expect(body.data[0]).to.have.property('status').that.is.equal(-1);
          expect(body.data[0]).to.have.property('fromPumaWallet').that.is.equal(null);
          done(err);
        });
    });

    describe('should handle tx data', async () => {
      beforeEach(async () => {
        await initiateSession();
      });
      afterEach(async () => {
        await deleteSession();
      });

      const expectedResponse = {
        success: true,
        status: 'OK',
        message: 'Retrieved transaction data succesfully',
        data: [{
          description: testItem.description,
          name: testItem.title,
          networkid: networkid,
          to: '',
          value: testItem.price
        }]
      }

      it('should return the tx data', (done) => {
        server.get(`${endpoint}/tx/${sessionID}/${testItem.itemID}`)
          .expect(200)
          .end((err: Error, res: any) => {
            const body = res.body;
            expect(body).to.have.property('success').that.is.equal(expectedResponse.success);
            expect(body).to.have.property('status').that.is.equal(expectedResponse.status);
            expect(body).to.have.property('message').that.is.equal(expectedResponse.message);
            expect(body).to.have.property('data').to.be.an('array');
            expect(body.data[0]).to.have.property('description').that.is.equal(testItem.description);
            expect(body.data[0]).to.have.property('name').that.is.equal(testItem.title);
            expect(body.data[0]).to.have.property('value').that.is.equal(unit.convert(testItem.price, 'eth', 'wei'));
            expect(body.data[0]).to.have.property('to');
            expect(body.data[0]).to.have.property('callback');
            expect(body.data[0]).to.have.property('signature');
            done(err);
          });
      })
    });
  });
});
