const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
app.use(express.json());
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uana9.mongodb.net/gym-pro-project?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("gym-pro-project");
    const classesCollection = database.collection("classes");
    const enrollCollection = database.collection("enroll");
    // Add Class
    app.post("/addClass", async (req, res) => {
      const classData = req.body;
      const result = await enrollCollection.insertOne(classData);
      res.json(result);
    });
    // get Class
    app.get("/getClass/:email", async (req, res) => {
      const email = req.params.email;
      const cursor = await enrollCollection.find({email: email});
      const orders = await cursor.toArray();
      res.json(orders);
    });
    // Get Order
    app.get("/classes", async (req, res) => {
      const cursor = classesCollection.find({});
      const orders = await cursor.toArray();
      res.json(orders);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
