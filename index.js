const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ttaom.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
	try {
		await client.connect();
		const serviceCollection = client.db("todo").collection("services");

		app.get("/service", async (req, res) => {
			const query = {};
			const cursor = serviceCollection.find(query);
			const services = await cursor.toArray();
			res.json(services);
		});

		app.get("/service/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await serviceCollection.findOne(query);
			res.json(result);
		});
		
		app.post('/service', async (req, res) =>{
			const service = req.body;
			const result = await serviceCollection.insertOne(service);
			res.json(result);
		});

		
	} 
	finally {
	}
}

run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("Hello from ToDo!");
});

app.listen(port, () => {
	console.log(`ToDo app listening on port ${port}`);
});
