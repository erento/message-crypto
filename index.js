const crypto = require('crypto');

const SIGN_HASH = 'sha512',
CIPHER = 'aes-128-cbc',
UTF8 = 'utf8';

function _verifySignature(b64body, signKey, signature) {
    return new Promise(
        function(resolve, reject) {
            const hmac = crypto.createHmac(SIGN_HASH, signKey);

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
            let buf = Buffer.from(b64body, 'base64'),
            iv = buf.slice(0, 16),
            message = buf.slice(16, buf.length);
            var decipher = crypto.createDecipheriv(CIPHER, crypto.createHash('md5').update(encryptionKey).digest(), iv);
            resolve(decipher.update(message.toString('base64'), 'base64', UTF8) + decipher.final(UTF8));
        }).catch(
            function(err) {
                throw err;
            });
}

module.exports = {
    verifySignature: _verifySignature,
    decrypt: _decrypt
}
