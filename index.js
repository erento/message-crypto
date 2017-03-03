const crypto = require('crypto');

const Error = function(msg) {
                  return {
                      "message": msg
                  }
              };

function _verifySignature(b64body, signKey, signature) {
    return new Promise(
        function(resolve, reject) {
            const hmac = crypto.createHmac('sha512', signKey);

            hmac.on('readable', function() {
                const data = hmac.read();
                if (data) {
                    resolve(data.toString('base64') == signature);
                } else {
                    reject(new Error('Hashing failed'));
                }
            });

            hmac.write(b64body);
            hmac.end();
        });
}

function _decrypt(b64body, encryptionKey) {
    return new Promise(
        function(resolve, reject) {
            var decipher = crypto.createDecipher('aes-128-ecb', encryptionKey);
            resolve(decipher.update(b64body, 'base64', 'utf8') + decipher.final('utf8'));
        }).catch(
            function(err) {
                if (err.message !== 'error:06065064:digital envelope routines:EVP_DecryptFinal_ex:bad decrypt') {
                    throw err;
                } else {
                    throw new Error('Decryption failed.');
                }
            });
}

module.exports = {
    verifySignature: _verifySignature,
    decrypt: _decrypt
}
