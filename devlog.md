# Devlog

## Day 0 (2023-11-14)

### General Idea behind WebAuthn

Your hardware token proves it is really you trying to access the resource (e.g. log in). I.e. it solves for Authentication. It does so by following a traditional asymmetric cryptography scheme:

1. The server knows your public key (how? covered in the registration process...)
2. The server gives you a "challenge", e.g. some random data it generates. Let's go with hex `0xDEADBEEF` (4 bytes). In reality this would be a much larger sequence of bytes.
3. Your hardware token signs this data using the corresponding private key, to produce a signature.
4. The server checks that the correct data (`0xDEADBEEF`) was signed with the correct private key.
5. Since only you have access to the private key (in theory), other's cannot fake it. Furthermore, with hardware tokens such as Yubikeys, the private key resides in the Yubikey, and cannot be exported.

TODO: Talk about the browser's role in this, and how registration works.

## 2023-11-18

### WebAuthn Registration

During registration, the remote server has no idea about your Yubikey. It will just present a challenge, which you would then sign with your Private key, and send that back to the server, along with your Public key. This will allow it to check that the public key matches the signature, to verify future signatures as belonging to you.

During registration, your browser prompts your device to "create a credential", and provides the ID of the website (the `rpId`). 

The device (e.g. Yubikey) then generates a Public/Private key (TBD: How this FIDO stuff works). And then sends the public key to the server.

Note: It seems in this step nothing (E.g. the challenge) is signed! So the browser / client needs to be trusted. (I guess always...?)

### WebAuth Authentication

Now, the backend gives the browser (website) a challenge (e.g. `0xDEADBEEF`), and a "Key ID". This tells the authenticator which key to use.

The yubikey will then sign the challenge with the private key, which the browser can send to the server.

The server then checks the signature to make sure it's legit.

## 2023-11-22

We log several things during registration, amongst them the public key, for instance:`9oug+qe0hQan3bUSoM3Rt4h6yFGvbU1V2fiPqVD+BMYxqr31fYXSWBTJmt2o7OxLtKEfUa3EGvEXWtqT3dQO/rkJk5DcO5Sz3ynecWR75iQEzBe2XEWppFszsHF9NczUMa6aVevdQePMFZbb3017bw3vPXk8kMHZUTSLJydkehI=`

We can verify this is an Ed25519 public key using OpenSSL:

```
$ echo -n "MCowBQYDK2VwAyEAfP8osGAz1XmwKPJZfQnx+hYGpsLX27iHkJL7GbkHYCg=" | base64 -d | openssl ec -pubin -pubout -text
read EC key
ED25519 Public-Key:
pub:
    7c:ff:28:b0:60:33:d5:79:b0:28:f2:59:7d:09:f1:
    fa:16:06:a6:c2:d7:db:b8:87:90:92:fb:19:b9:07:
    60:28
writing EC key
-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAfP8osGAz1XmwKPJZfQnx+hYGpsLX27iHkJL7GbkHYCg=
-----END PUBLIC KEY-----
```

### Signature Verification (Manual)

The verification step will log some values in base64 in the console.

These can be put into the `verify.sh` script, which will perform signature validation as per https://w3c.github.io/webauthn/#sctn-verifying-assertion . (Note: We only really do steps 20 & 21 in the script, i.e. cryptographic validation)

## Resources
