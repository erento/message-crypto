const messageCrypto = require('../index.js');

describe('encryption', () => {
    test('should encrypt a decryptable message', async () => {
        const result = await messageCrypto.encrypt('TestMessageA', 'TestAESKey');
        await expect(messageCrypto.decrypt(result, 'TestAESKey')).resolves.toBe('TestMessageA');
    });
});
