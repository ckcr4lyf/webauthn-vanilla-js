import express from 'express';
import { verify } from './crypto.js';

const app = express();
const port = '3553';

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

app.post('/api/verify', (req, res) => {
    console.log(req.body);

    const clientData = Buffer.from(req.body.cData, "base64");
    const authData = Buffer.from(req.body.authData, "base64");
    const signature = Buffer.from(req.body.sign, "base64");

    verify(clientData, authData, signature);

    // console.log(req.bod)
    res.send('Hello world');
});

app.listen(port, () => {
    console.log(`Started server`);
});
