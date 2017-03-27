'use strict';

const should = require('should'),
      pubsub = require('../index.js');

describe('pubsub', function() {
    this.timeout(10000);

    it('should decrypt a message', function(done) {
        const tests = [
            pubsub.decrypt('wi/WnD0ujMRoTG/d6cAGufSZ0rxaNE8uUXFE+eYqfR4=', 'TestAESKey').then(function(result) {
                result.should.equal('A123');
            }).catch(function(err) {
                throw err;
            }),
            pubsub.decrypt('Wi/WnD0ujMRoTG/d6cAGufSZ0rxaNE8uUXFE+eYqfR4=', 'TestAESKey').then(function(result) {
                return null;
            }).catch(function(err) {
                err.message.should.equal('error:06065064:digital envelope routines:EVP_DecryptFinal_ex:bad decrypt');
            }),
            pubsub.decrypt('wi/WnD0ujMRoTG/d6cAGufSZ0rxaNE8uUXFE+eYqfR4=', 'TestKey').then(function(result) {
                return null;
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
