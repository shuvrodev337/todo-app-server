const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

// const jwt = require('jsonwebtoken');
const port = process.env.PORT || 3000;
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World! todo Server is running!!");
});

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ez2ieyu.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Create collections here
    const usersCollection = client.db("todoDB").collection("usersCollection");
    const todoCollection = client.db("todoDB").collection("todoCollection");

    // CRUD operation here

    // ---Inserting user to db---//
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);

      if (existingUser) {
        return res.send({ message: "user already exists in Database" });
      }

      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // --Add To Do--//
    app.post("/todos", async (req, res) => {
      const newTodo = req.body;
      const result = await todoCollection.insertOne(newTodo);
      res.send(result);
    });

    //--get user specific todos--//
    app.get("/todos", async (req, res) => {
      const userEmail = req.query.email
      const query = {email: userEmail}
      const result = await todoCollection.find(query).toArray()
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`My Samurai app listening on port ${port}`);
});
