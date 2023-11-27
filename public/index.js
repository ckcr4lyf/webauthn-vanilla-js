function base64ToBytes(base64) {
    const binString = atob(base64);
    return Uint8Array.from(binString, (m) => m.codePointAt(0));
}

function bytesToBase64(bytes) {
    const binString = String.fromCodePoint(...bytes);
    return btoa(binString);
}

async function register() {
    var challenge = document.getElementById("challenge");
    var encoder = new TextEncoder();
    var challengeBytes = encoder.encode(challenge.value);
    console.log(`Challenge is`, challengeBytes);

    let credential = await navigator.credentials.create({
        publicKey: {
            challenge: challengeBytes,
            rp: { name: "Example Registration" },
            user: {
                id: new Uint8Array([0, 1, 2, 3, 4, 5]),
                name: "john@doe.com",
                displayName: "John Doe"
            },
            pubKeyCredParams: [{ type: "public-key", alg: -8 }]
        }
    });

    console.log(credential);

    console.log(`ID is: ${bytesToBase64(new Uint8Array(credential.rawId))}`);
    console.log(`Public key is: ${bytesToBase64(new Uint8Array(credential.response.getPublicKey()))}`);

    await fetch('/api/register', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: bytesToBase64(new Uint8Array(credential.rawId)),
            key: bytesToBase64(new Uint8Array(credential.response.getPublicKey())),
        })
    });

    // First 32 (0, 32) bytes are SHA256 of rpId (e.g. "localhost")
    // 33rd byte (32, 33) is flags
    // (33, 37) is sign count
    // (37, 53) is AAGUID of authenticator
    // (53, 55) is uint16 len of cred data (e.g. 128)
    // (55, 55+128) is public key data
    // (183, end) is sign?
}

async function verify() {

    // Get challenge
    var res = await fetch('/api/challenge', {
        method: "GET",
    });

    var data = JSON.parse(await res.text());

    // var challenge = document.getElementById("challenge_v");
    // var encoder = new TextEncoder();
    // var challengeBytes = encoder.encode(challenge.value);
    var challengeBytes = base64ToBytes(data.challenge);
    console.log(`Challenge is`, challengeBytes);

    let cc = await navigator.credentials.get({
        publicKey: {
            challenge: challengeBytes,
            allowCredentials: [{
                type: "public-key",
                // Corresponding public key: "MCowBQYDK2VwAyEAfP8osGAz1XmwKPJZfQnx+hYGpsLX27iHkJL7GbkHYCg=" (Should be ed25519?)
                id: base64ToBytes("hF6IQhNB0R3gOGR1Fc0/jgOeSxrMHwyatoRz1l2f8beOWFa19bn43mEmnld6z8+/iCVh93hn4O2ZqFxiAobFrjmFF/s64GsQUPGYNPFLgwyPlrp78G5i+FzqxOCWzQa3vzHC6q5+xIDZkD9NGBEpvGLiuLP87/rqREJqwN0k2sU="),
                // id: new Uint8Array([207,59,97,244,128,117,138,78,184,57,43,45,75,57,222,191,249,225,61,253,72,23,107,214,185,229,223,113,118,155,227,105,93,224,82,14,23,60,53,13,117,2,98,9,10,216,160,179,197,97,225,4,133,196,69,5,189,209,17,208,97,17,23,196,99,22,247,86,167,163,13,99,223,234,149,88,67,62,218,100,104,122,134,131,123,162,16,132,80,190,108,1,101,142,122,18,0,211,120,114,63,7,19,22,126,161,98,62,75,85,138,121,15,112,71,45,191,220,244,187,29,197,189,209,103,94,182,217])
            }],
            userVerification: "required",
        }
    });

    console.log(cc);

    var response = cc.response;
    var cData = response.clientDataJSON
    var authData = response.authenticatorData;
    var signature = response.signature;

    var decoder = new TextDecoder();

    var c64 = bytesToBase64(new Uint8Array(cData));
    var cJSON = JSON.parse(decoder.decode(cData));
    console.log(cJSON); // { .challenge, .origin, .type }
    console.log('\n');
    console.log(`cData as b64: ${c64}`);

    var auth64 = bytesToBase64(new Uint8Array(authData));
    console.log(`authData as b64: ${auth64}`);

    var sig64 = bytesToBase64(new Uint8Array(signature));
    console.log(`signature as b64: ${sig64}`);

    await fetch('/api/verify', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        
        body: JSON.stringify({
            cData: c64,
            authData: auth64,
            sign: sig64,
        })
    });

}