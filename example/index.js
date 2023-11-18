async function register(){
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

    console.log(cbor.decodeAllSync(credential.response.attestationObject))
}