import crypto from 'crypto';

const pubkey = crypto.createPublicKey({
    key: Buffer.from("MCowBQYDK2VwAyEAfP8osGAz1XmwKPJZfQnx+hYGpsLX27iHkJL7GbkHYCg=", 'base64'),
    format: 'der',
    type: 'spki',
});

export const verify = (cData: Buffer, authData: Buffer, sign: Buffer): boolean => {
    const hash = crypto.createHash('sha256');
    hash.update(cData);
    
    const rawHash = hash.digest();

    // The concatenation of authData & hash of cData is what is signed
    const concat = Buffer.concat([authData, rawHash]);

    const res = crypto.verify(undefined, concat, pubkey, sign);
    console.log("Result: ", res);
    return res;
}