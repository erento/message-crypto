const messageCrypto = require('../index.js');

describe('signature', () => {
    test('should verify a signature', async () => {
        await expect(messageCrypto.verifySignature('VGVzdDExMQ==', 'A123', 'PC1eiR76WQDfU79IR7U+J6hmEJrBe4y4s8quoF0USBrwxc0ju2HIUKc2LKNknvvNe6V1Y71FAdQV5uNuoUTQew=='))
            .resolves
            .toBe(true);

        await expect(messageCrypto.verifySignature('VGVzdDExMF==', 'A123', 'PC1eiR76WQDfU79IR7U+J6hmEJrBe4y4s8quoF0USBrwxc0ju2HIUKc2LKNknvvNe6V1Y71FAdQV5uNuoUTQew=='))
            .resolves
            .toBe(false);

        await expect(messageCrypto.verifySignature('VGVzdDExMQ==', 'A1234', 'PC1eiR76WQDfU79IR7U+J6hmEJrBe4y4s8quoF0USBrwxc0ju2HIUKc2LKNknvvNe6V1Y71FAdQV5uNuoUTQew=='))
            .resolves
            .toBe(false);

        await expect(messageCrypto.verifySignature('VGVzdDExMQ==', 'A123', 'GC1eiR76WQDfU79IR7U+J6hmEJrBe4y4s8quoF0USBrwxc0ju2HIUKc2LKNknvvNe6V1Y71FAdQV5uNuoUTQew=='))
            .resolves
            .toBe(false);
    });

    test('should verify an event\'s signature', async () => {
        await expect(messageCrypto.verifyEventSignature({data: 'VGVzdDExMQ==', attributes: {signature: 'PC1eiR76WQDfU79IR7U+J6hmEJrBe4y4s8quoF0USBrwxc0ju2HIUKc2LKNknvvNe6V1Y71FAdQV5uNuoUTQew=='}}, 'A123'))
            .resolves
            .toBe('VGVzdDExMQ==');

        await expect(messageCrypto.verifyEventSignature({message: {data: 'VGVzdDExMQ==', attributes: {signature: 'PC1eiR76WQDfU79IR7U+J6hmEJrBe4y4s8quoF0USBrwxc0ju2HIUKc2LKNknvvNe6V1Y71FAdQV5uNuoUTQew=='}}}, 'A123'))
            .resolves
            .toBe('VGVzdDExMQ==');
    });

    test('should create a signature', async () => {
        await expect(messageCrypto.createSignature('VGVzdDExMQ==', 'A123'))
            .resolves
            .toBe('PC1eiR76WQDfU79IR7U+J6hmEJrBe4y4s8quoF0USBrwxc0ju2HIUKc2LKNknvvNe6V1Y71FAdQV5uNuoUTQew==');
    });
});
