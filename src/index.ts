import express from 'express';

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

app.listen(port, () => {
    console.log(`Started server`);
});
