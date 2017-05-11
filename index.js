const crypto = require('crypto');

const SIGN_HASH = 'sha512',
CIPHER = 'aes-128-cbc',
UTF8 = 'utf8',
AES_BLOCK_SIZE = 16;

function _createSignature(b64body, signKey) {
    return new Promise(
        function(resolve, reject) {
            const hmac = crypto.createHmac(SIGN_HASH, signKey);

            hmac.on('readable', function() {
                const data = hmac.read();
                if (data) {
                    resolve(data.toString('base64'));
                } else {
                    reject(new Error('Hashing failed'));
                }
            });

            hmac.write(b64body);
            hmac.end();
        });
}

function _verifySignature(b64body, signKey, signature) {
    return new Promise(
        function(resolve, reject) {
            _createSignature(b64body, signKey)
            .then(
                function(createdSignature) {
                    resolve(createdSignature === signature);
                }
            ).catch(reject);
        });
}

function _decrypt(b64body, encryptionKey) {
    return new Promise(
        function(resolve, reject) {
            let buf = Buffer.from(b64body, 'base64'),
            iv = buf.slice(0, AES_BLOCK_SIZE),
            message = buf.slice(AES_BLOCK_SIZE, buf.length);
            var decipher = crypto.createDecipheriv(CIPHER, crypto.createHash('md5').update(encryptionKey).digest(), iv);
            resolve(decipher.update(message.toString('base64'), 'base64', UTF8) + decipher.final(UTF8));
        }).catch(
            function(err) {
                throw err;
            });
}

function _encrypt(message, encryptionKey) {
    return new Promise(
        function(resolve, reject) {
            let iv = crypto.randomBytes(AES_BLOCK_SIZE);
            var cipher = crypto.createCipheriv(CIPHER, crypto.createHash('md5').update(encryptionKey).digest(), iv);
            var encStr = cipher.update(message, UTF8, 'base64') + cipher.final('base64'),
                encBuffer = Buffer.from(encStr, 'base64'),
                enc = Buffer.concat([iv, encBuffer]);

            resolve(enc.toString('base64'));
        }).catch(
            function(err) {
                throw err;
            });
}

module.exports = {
    verifySignature: _verifySignature,
    createSignature: _createSignature,
    decrypt: _decrypt,
    encrypt: _encrypt
}
