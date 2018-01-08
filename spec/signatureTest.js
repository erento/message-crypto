'use strict';

const should = require('should'),
      pubsub = require('../index.js');

describe('pubsub', function() {
    this.timeout(10000);

    const catchHandler = function(done) {
                             return function(err) {
                                 return done(err);
                             };
                         };

    it('should verify a signature', function(done) {
        const tests = [
            pubsub.verifySignature('VGVzdDExMQ==', 'A123', 'PC1eiR76WQDfU79IR7U+J6hmEJrBe4y4s8quoF0USBrwxc0ju2HIUKc2LKNknvvNe6V1Y71FAdQV5uNuoUTQew==').then(function(result) {
                result.should.be.true();
            }).catch(catchHandler(done)),
            pubsub.verifySignature('VGVzdDExMF==', 'A123', 'PC1eiR76WQDfU79IR7U+J6hmEJrBe4y4s8quoF0USBrwxc0ju2HIUKc2LKNknvvNe6V1Y71FAdQV5uNuoUTQew==').then(function(result) {
                result.should.be.false();
            }).catch(catchHandler(done)),
            pubsub.verifySignature('VGVzdDExMQ==', 'A1234', 'PC1eiR76WQDfU79IR7U+J6hmEJrBe4y4s8quoF0USBrwxc0ju2HIUKc2LKNknvvNe6V1Y71FAdQV5uNuoUTQew==').then(function(result) {
                result.should.be.false();
            }).catch(catchHandler(done)),
            pubsub.verifySignature('VGVzdDExMQ==', 'A123', 'GC1eiR76WQDfU79IR7U+J6hmEJrBe4y4s8quoF0USBrwxc0ju2HIUKc2LKNknvvNe6V1Y71FAdQV5uNuoUTQew==').then(function(result) {
                result.should.be.false();
            }).catch(catchHandler(done))
        ];

        Promise.all(tests).then(done());
    });

    it('should verify an event\'s signature', function(done) {
        const tests = [
            pubsub.verifyEventSignature({data: 'VGVzdDExMQ==', attributes: {signature: 'PC1eiR76WQDfU79IR7U+J6hmEJrBe4y4s8quoF0USBrwxc0ju2HIUKc2LKNknvvNe6V1Y71FAdQV5uNuoUTQew=='}}, 'A123').then(function(result) {
                result.should.be.equal('VGVzdDExMQ==');
            }).catch(catchHandler(done)),
            pubsub.verifyEventSignature({message: {data: 'VGVzdDExMQ==', attributes: {signature: 'PC1eiR76WQDfU79IR7U+J6hmEJrBe4y4s8quoF0USBrwxc0ju2HIUKc2LKNknvvNe6V1Y71FAdQV5uNuoUTQew=='}}}, 'A123').then(function(result) {
                result.should.be.equal('VGVzdDExMQ==');
            }).catch(catchHandler(done))
        ];

        Promise.all(tests).then(done());
    });

    it('should create a signature', function(done) {
        const tests = [
            pubsub.createSignature('VGVzdDExMQ==', 'A123').then(function(result) {
                result.should.be.equal('PC1eiR76WQDfU79IR7U+J6hmEJrBe4y4s8quoF0USBrwxc0ju2HIUKc2LKNknvvNe6V1Y71FAdQV5uNuoUTQew==');
            }).catch(catchHandler(done))
        ];

        Promise.all(tests).then(done());
    });
});
