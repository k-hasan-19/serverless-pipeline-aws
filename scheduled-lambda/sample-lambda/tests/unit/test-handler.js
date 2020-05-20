'use strict';

const app = require('../../app.js');
const chai = require('chai');
const expect = chai.expect;
var event, context;

describe('Tests index', function() {
    it('verifies successful response', async() => {
        const result = await app.lambda_handler(event, context)

        let response = JSON.parse(result);

        expect(response).to.be.an('object');
        expect(response.ConsumedCapacity.CapacityUnits).to.be.equal(1);
        // expect(response.location).to.be.an("string");
    });
});
