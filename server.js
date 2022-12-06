const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://sajeeb:sajeeb@niduser.ln7prrt.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const inventoryCollection = client.db('niduser').collection('niduser');
        const userCollection = client.db('ownUser').collection('user');
        console.log('db connected');

        // AUTH
        // app.post('/login', async (req, res) => {
        //     const user = req.body;
        //     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        //         expiresIn: '1d'
        //     });
        //     res.send({ accessToken });
        // })

        // user nid 
        app.get('/usernid', async (req, res) => {
            const cursor = inventoryCollection.find()
            const usernid = await cursor.toArray();
            res.send(usernid)
        });

        app.get('/user', async (req, res) => {
            const cursor = userCollection.find()
            const usernid = await cursor.toArray();
            res.send(usernid)
        });

        app.get('/lastuser', async (req, res) => {
            const cursor = userCollection.find().sort({ _id: -1 }).limit(1)
            const usernid = await cursor.toArray();
            res.send(usernid)
        });

        //ADD ITEM API
        app.post('/user', async (req, res) => {
            const newItem = req.body;
            const usernid = await userCollection.insertOne(newItem);
            res.send(usernid);
            console.log(usernid);
        });



    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('NID USER SERVER RUNNING')
});


app.listen(port, () => {
    console.log('Listening to port', port);
})
