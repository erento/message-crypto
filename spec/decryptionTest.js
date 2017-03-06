'use strict';

const should = require('should'),
      pubsub = require('../index.js');

describe('pubsub', function() {
    this.timeout(10000);

    it('should decrypt a message', function(done) {
        const tests = [
            pubsub.decrypt('Pa96UDfeLNKI9ygjJ7kAyg==', 'TestAESKey').then(function(result) {
                result.should.equal('A123');
            }).catch(function(err) {
                done(err);
            }),
            pubsub.decrypt('Pa97UDfeLNKI9ygjJ7kAyg==', 'TestAESKey').then(function(result) {
                done(null);
            }).catch(function(err) {
                err.message.should.equal('error:06065064:digital envelope routines:EVP_DecryptFinal_ex:bad decrypt');
            }),
            pubsub.decrypt('Pa96UDfeLNKI9ygjJ7kAyg==', 'TestKey').then(function(result) {
                done(null);
            }).catch(function(err) {
                err.message.should.equal('error:06065064:digital envelope routines:EVP_DecryptFinal_ex:bad decrypt');
            })
        ]

        Promise.all(tests).then(done()).catch(
            function(err) {
                done(err);
            });
    });
});
