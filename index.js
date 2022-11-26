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
      const query = {};
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
        name: booking.name,
        location: booking.location,
        phone: booking.phone,
      };
      const result = await bookingsCollection.insertOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.log);

app.get("/", async (req, res) => {
  res.send("Unique store runnig away");
});

app.listen(port, () => {
  console.log(`unique store is running on ${port}`);
});
