const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.stqqfzx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1
    });

async function run() {
    try {
        const blogCollection = client.db("shakurBlog").collection("blogs");

        app.get("/", async (req, res) => {
            const query = {};
            const result = await blogCollection.find(query).toArray();
            res.send(result);
        });

        app.post("/addblog", async (req, res) => {
            const blog = req.body;
            const result = await blogCollection.insertOne(blog);
            res.send(result);
        });

        app.put("/updateblog/:id", async (req, res) => {
            const id = req.params.id;
            const updatedBlog = req.body;
            const filter = { _id: new ObjectId(id) };
            const updatedDocument = {
                $set: {
                    blog: updatedBlog,
                },
            };
            const result = await blogCollection.updateOne(filter, updatedDocument);
            res.send(result);
        });

        app.delete("/deleteblog/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await blogCollection.deleteOne(filter);
            res.send(result);
        });



    } finally {

    }
}
run().catch(console.dir);

app.get('/', async (req, res) => {
    res.send("Blog server is running")
})

app.listen(port, () => console.log(`Blog server is running on ${port}`))