import express from 'express';
import crypto from 'crypto';
import { verify } from './crypto.js';

const app = express();
const port = '3553';

// const PASSWORD = 
let challenge: Buffer;

app.use(express.static('public'));

app.get('/api', (req, res) => {
    res.send('Hello world');
});

app.use(express.json());
app.post('/api/register', (req, res) => {
    console.log(req.body);
    // console.log(req.bod)
    res.send('Hello world');
});

app.get('/api/challenge', (req, res) => {
    challenge = crypto.randomBytes(32);
    return res.json({
        challenge: challenge.toString('base64'),
    });
})

app.post('/api/verify', (req, res) => {
    if (challenge.length !== 32){
        console.error(`No set challenge!`);
        return res.status(400).send(`Uh oh`);
    }

    console.log(req.body);

    const clientData = Buffer.from(req.body.cData, "base64");
    const clientDataJSON = JSON.parse(clientData.toString());

    console.log(clientDataJSON);

    const submittedChallenge = Buffer.from(clientDataJSON.challenge, "base64");

    if (Buffer.compare(challenge, submittedChallenge) !== 0){
        console.error(`wrong challenge!`);
        return res.status(401).send(`Fuck u`);
    }

    // Challenge is ok, clear global before signature verification
    challenge = Buffer.alloc(0);
    
    const authData = Buffer.from(req.body.authData, "base64");
    const signature = Buffer.from(req.body.sign, "base64");

    if (verify(clientData, authData, signature) === true){
        console.log(`legit`);
        return res.send('Hello world');
    }    

    console.error(`dodgy!`);
    return res.status(401).send(`Fuck u`);
});

app.listen(port, () => {
    console.log(`Started server`);
});
