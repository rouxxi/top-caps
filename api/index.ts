import {db} from './database/ORM/database-manager.ts';
import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";

const app = express();
const port = 4200

app.use(cors({
    origin: '*',
}))
app.use(bodyParser.json());

app.get('/games', async (req, res) => {
    try {
        const id = req.query.id
        const data = await db.findById(id);
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send('Internal Server Error', error.message);
    }
});


app.post('/games', async (req, res) => {
    try {
        const {id, ...payload} = req.body;
        if (id && payload) {
            await db.createNewGame(id, payload);
            res.status(201).send(id);
        }
        res.status(400).send('Not Created');

    } catch (error) {
        res.status(500).send('Internal Server Error', error.message);
    }
});

app.put('/games', async (req, res) => {
    try {
        const {id, ...payload} = req.body;

        if (id && payload) {
            await db.updateGame(id, payload);
            res.status(204).send(id);
        }
        res.status(404).send('NotFound');
    } catch (error) {
        res.status(500).send('Internal Server Error', error.message);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})