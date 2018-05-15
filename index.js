const crypto = require('crypto');

const SIGN_HASH = 'sha512';
const CIPHER = 'aes-128-cbc';
const UTF8 = 'utf8';
const AES_BLOCK_SIZE = 16;

function createSignature(b64body, signKey) {
    return new Promise((resolve, reject) => {
        const hmac = crypto.createHmac(SIGN_HASH, signKey);

        hmac.on('readable', () => {
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

function verifySignature(b64body, signKey, signature) {
    return new Promise((resolve, reject) => {
        createSignature(b64body, signKey)
            .then((createdSignature) => {
                resolve(createdSignature === signature);
            }).catch(reject);
    });
}

function decrypt(b64body, encryptionKey) {
    return new Promise((resolve) => {
        const buf = Buffer.from(b64body, 'base64');
        const iv = buf.slice(0, AES_BLOCK_SIZE);
        const message = buf.slice(AES_BLOCK_SIZE, buf.length);
        const decipher = crypto.createDecipheriv(CIPHER, crypto.createHash('md5').update(encryptionKey).digest(), iv);

        const part1 = decipher.update(message.toString('base64'), 'base64', UTF8);
        const part2 = decipher.final(UTF8);
        resolve(part1 + part2);
    });
}

function encrypt(message, encryptionKey) {
    return new Promise((resolve) => {
        const iv = crypto.randomBytes(AES_BLOCK_SIZE);
        const cipher = crypto.createCipheriv(CIPHER, crypto.createHash('md5').update(encryptionKey).digest(), iv);
        const encStr = cipher.update(message, UTF8, 'base64') + cipher.final('base64');
        const encBuffer = Buffer.from(encStr, 'base64');
        const enc = Buffer.concat([iv, encBuffer]);

        resolve(enc.toString('base64'));
    });
}

function verifyEventSignature(event, signKey) {
    const body = event && event.message && event.message.data || event && event.data || undefined;
    const signature = event && event.message && event.message.attributes && event.message.attributes.signature || event && event.attributes && event.attributes.signature || undefined;

    return verifySignature(body, signKey, signature)
        .then((check) => {
            if (check === true) {
                return body;
            }
            throw {error: 'Signature check failed.', code: 'wrongSignature'};
        });
}

module.exports = {
    verifyEventSignature: verifyEventSignature,
    verifySignature: verifySignature,
    createSignature: createSignature,
    decrypt: decrypt,
    encrypt: encrypt,
};
