const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fmq8a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
    try{
        await client.connect();
        const database = client.db('Tourism');
        const productCollection = database.collection('tour');
        const orderCollection = database.collection('orders');

        // GET Products Api
        app.get('/tour', async(req, res) => {
            const cursor = productCollection.find({});
            const tour = await cursor.toArray();
            res.send(tour);
        });

        // Add Orders 
        app.post('/orders', async(req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/',(req, res) => {
    res.send('tour plan server is running');
});

app.listen(port, () => {
    console.log('server as port', port);
});