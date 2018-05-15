const messageCrypto = require('../index.js');

describe('decryption', () => {
    test('should decrypt a message', () => {
        return expect(messageCrypto.decrypt('wi/WnD0ujMRoTG/d6cAGufSZ0rxaNE8uUXFE+eYqfR4=', 'TestAESKey'))
            .resolves
            .toMatchSnapshot();
    });

    test('should fail to decrypt a message', () => {
        return expect(messageCrypto.decrypt('Wi/WnD0ujMRoTG/d6cAGufSZ0rxaNE8uUXFE+eYqfR4=', 'TestAESKey'))
            .resolves
            .toMatchSnapshot();
    });

    test('should fail to decrypt a message', () => {
        return expect(messageCrypto.decrypt('wi/WnD0ujMRoTG/d6cAGufSZ0rxaNE8uUXFE+eYqfR4=', 'TestKey'))
            .rejects
            .toThrowError('error:06065064:digital envelope routines:EVP_DecryptFinal_ex:bad decrypt');
    });
});
