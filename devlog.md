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

## Resources
