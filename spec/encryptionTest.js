'use strict';

const should = require('should'),
pubsub = require('../index.js');

describe('pubsub', function() {
    this.timeout(10000);

    it('should encrypt a decryptable message', function(done) {
        pubsub.encrypt('TestMessageA', 'TestAESKey')
        .then(
            function(result) {
                pubsub.decrypt(result, 'TestAESKey')
                .then(function(resultdec) {
                    resultdec.should.equal('TestMessageA');
                    done();
                })
                .catch(function(err) {
                    done(err);
                });
            })
        .catch(
            function(err) {
                done(err);
            })
    });
});
