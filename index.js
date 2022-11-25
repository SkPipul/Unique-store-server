const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;


const app = express();

// midleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.zgj4c3m.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run(){
    try{
        const categoriesCollection = client.db('uniqueStore').collection('categories');
        const productsCollection = client.db('uniqueStore').collection('products')

        app.get('/categories', async(req, res) => {
            const query = {};
            const result = await categoriesCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/products', async(req, res) => {
            const query = {}
            const product = await productsCollection.find(query).toArray();
            res.send(product);
        });

        app.get('/products/:id', async(req, res) => {
            const id = req.params.id;
            const query = {categoryId: (id)}
            const product = await productsCollection.find(query).toArray();
            res.send(product)
        })

    }
    finally{

    }
}

run().catch(console.log);

app.get('/', async(req, res) => {
    res.send('Unique store runnig away')
})

app.listen(port, () => {
    console.log(`unique store is running on ${port}`)
})
