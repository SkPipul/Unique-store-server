const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// midleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.zgj4c3m.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const categoriesCollection = client
      .db("uniqueStore")
      .collection("categories");
    const productsCollection = client.db("uniqueStore").collection("products");
    const bookingsCollection = client.db("uniqueStore").collection("bookings");
    const usersCollection = client.db("uniqueStore").collection("users");
    const advertiseCollection = client.db("uniqueStore").collection("advertise");

    app.get("/categories", async (req, res) => {
      const query = {};
      const result = await categoriesCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const query = {};
      const product = await productsCollection.find(query).toArray();
      res.send(product);
    });

    app.get('/myproducts', async(req, res) => {
      let query = {};
      if(req.query.email){
        query = {
          email: req.query.email
        }
      }
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });

    app.delete('/myproducts/:id',async(req, res) => {
      const id = req.params.id;
      const filter = {_id: ObjectId(id)};
      const product = await productsCollection.deleteOne(filter);
      res.send(product);
    })

    app.post('/products', async(req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    })

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { categoryId: id };
      const product = await productsCollection.find(query).toArray();
      res.send(product);
    });

    app.get("/products/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    app.get("/bookings", async (req, res) => {
      let query = {};
      if(req.query.email){
        query = {
          email: req.query.email
        }
      }
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const query = {
        email: booking.email,
        productName: booking.productName,
        originalPrice: booking.originalPrice,
        resalePrice: booking.resalePrice,
        image: booking.image,
        name: booking.name,
        location: booking.location,
        phone: booking.phone,
      };
      const result = await bookingsCollection.insertOne(query);
      res.send(result);
    });

    app.get('/users', async(req, res) => {
      const result = await usersCollection.find({}).toArray();
      res.send(result);
    })

    app.get('/users/user/:email', async(req, res) => {
      const email = req.params.email;
      const result = await usersCollection.findOne({email});
      res.send(result);
    });

    app.post('/users', async(req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result)
    });

    app.delete('/users/user/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: ObjectId(id)};
      const user = await usersCollection.deleteOne(filter);
      res.send(user);
    });

    app.get('/advertise', async(req, res) => {
      const result = await advertiseCollection.find({}).toArray();
      res.send(result);
    })

    app.post('/advertise', async(req, res) => {
      const add = req.body;
      const result = await advertiseCollection.insertOne(add);
      res.send(result);
    })

  } 

  finally {
  }
}

run().catch(console.log);

app.get("/", async (req, res) => {
  res.send("Unique store runnig away");
});

app.listen(port, () => {
  console.log(`unique store is running on ${port}`);
});
