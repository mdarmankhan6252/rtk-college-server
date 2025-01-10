const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ewhtdrn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   }
});

async function run() {
   try {

      const collegesCollection = client.db("CollegeDB").collection('colleges')
      const collegeNameCollection = client.db("CollegeDB").collection('collegeName')
      const candidatesCollection = client.db("CollegeDB").collection('candidates')

      app.get('/colleges', async (req, res) => {
         const search = req.query.search || '';
         let query = {}
         if (search) {
            query.collegeName = { $regex: search, $options: 'i' }
         }
         const result = await collegesCollection.find(query).toArray();
         res.send(result)
      })

      app.get('/college/:id', async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) };
         const result = await collegesCollection.findOne(query);
         res.send(result)
      })

      app.get('/popularCollege', async (req, res) => {
         const result = await collegesCollection.find().skip(8).limit(3).toArray();
         res.send(result)
      })

      app.get('/collegeName', async (req, res) => {
         const result = await collegeNameCollection.find().toArray();
         res.send(result)
      })

      app.get('/collegeName/:id', async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) }
         const result = await collegeNameCollection.findOne(query);
         res.send(result)
      })

      app.get('/candidates', async (req, res) => {
         const result = await candidatesCollection.find().toArray();
         res.send(result)
      })

      app.get('/candidate', async (req, res) => {
         const email = req.query.email;
         const query = { candidateEmail: email }
         const result = await candidatesCollection.find(query).toArray();
         res.send(result)
      })

      app.delete('/candidate/:id', async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) }
         const result = await candidatesCollection.deleteOne(query);
         res.send(result)
      })

      app.post('/candidate', async (req, res) => {
         const candidate = req.body;
         const result = await candidatesCollection.insertOne(candidate);
         res.send(result)
      })


      await client.db("admin").command({ ping: 1 });
      console.log("You successfully connected to MongoDB!");
   } finally {
      //  
   }
}
run().catch(console.dir);



app.get('/', (req, res) => {
   res.send('My server is running on port : ' + port)
})


app.listen(port, () => {
   console.log("My sever is running on port : ", port);
})