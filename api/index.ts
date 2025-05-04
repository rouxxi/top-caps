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
        console.log('in the getter')
        console.log(req.query);
        const id = req.query.id
        if (!id) {
            res.status(400).send("No ID sended")
            return;
        };
        const data = await db.findById(id);
        console.log(data)
        if (!data) {
            res.status(404).send('Not found')
            return;
        }
         res.setHeader('Content-Type', 'application/json');
         res.status(200).json(data);
         return;
    } catch (error) {
        res.status(500).send( error.message);
    }
});


app.post('/games', async (req, res) => {
    try {
        const {id, ...payload} = req.body;
        if (id && payload) {
            const data = await db.createNewGame(id, payload);
            console.log('data is created ?' , data)
            res.status(201).send(JSON.stringify(id));
            return;
        } else {
            res.status(400).send('Not Created');
            return;
        }
    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

app.put('/games', async (req, res) => {
    try {
        const {id, ...payload} = req.body;

        if (id && payload) {
            await db.updateGame(id, payload);
            res.status(204).send(id);
        } else {
            res.status(404).send('NotFound');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})