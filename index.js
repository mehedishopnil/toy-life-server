const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config()
const app = express();
const port = process.env.PORT || 5000;

//middleWare
app.use(cors());
app.use(express());


//MongoDB connect code here::
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.flzolds.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const galleryImageCollection = client.db("toyLife").collection("galleryImage");
    const toyProductsDataCollection = client.db("toyLife").collection("productsData");

    //Gallery Image::
    app.get('/galleryImage', async(req, res)=>{
        try{
            
            const cursor = galleryImageCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        }

        catch{ error => {
            console.log(error);
            res.status(500).send('Error fetching data from the database')
        }}
    })

    //Products Data::
    app.get('/productsData', async(req, res)=>{
      try{
        const cursor = toyProductsDataCollection.find();
        const result = await cursor.toArray();
        res.send(result)
      }
      catch{
        error => {
          console.log(error);
          res.status(500).send("Error fetching data from the database")
        }
      }
    })

    



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req, res)=>{
    res.send('ToyLife is running')
})

app.listen(port, ()=>{
    console.log(`ToyLife is running on port, ${port}`);
})