const express = require('express')
const cors = require("cors");
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const fileUpload = require("express-fileupload");
const ObjectId = require("mongodb").ObjectId
const fs = require("fs-extra");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u2izr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(express())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(fileUpload())
app.use(express.static("services"))
const port = 8080







app.get('/', (req, res) => {
  res.send('Welcome to Creative Agency Server!')
})



client.connect(err => {
    const ordersCollection = client.db(`${process.env.NAME}`).collection("orders");
    const servicesCollection = client.db(`${process.env.NAME}`).collection("services");
    const adminCollection = client.db(`${process.env.NAME}`).collection("admin");
    const reviewCollection = client.db(`${process.env.NAME}`).collection("reviews");

    // app.post("/addOrder", (req, res) => {

    //     const file = req.files.image;
    //     const orderData = JSON.parse(req.body.data);
    //     orderData.image = file.name;

    //     file.mv(`${__dirname}/orders/${file.name}`, error => {
    //         if(error){
    //             console.log(error);
    //             res.send({msg: "Failed to upload image"})
    //         }
    //         res.send({name: file.name, path: `/${file.name}`})
    //     })

    //     ordersCollection.insertOne(orderData)
    //     .then(result => {
    //         console.log(result);
    //     })

    // })


    // for add order
    app.post("/addOrder", (req, res) => {

      const file = req.files.image;
      const insertData = JSON.parse(req.body.data)

      const newImg = file.data;
      const encodedImg = newImg.toString("base64");
      
      const image = {
          contentType: file.mimetype,
          size: file.size,
          img: Buffer.from(encodedImg, "base64")
      };

      insertData.image = image;
      ordersCollection.insertOne(insertData)
      .then(result => {

        res.send(result.insertedCount > 0)
          
      })

  })

  app.get("/orderByUser/:email", (req, res) => {
    ordersCollection.find({email: req.params.email})
      .toArray((error, documents) => {

        // console.log(documents);
        res.send(documents)
      })
  })








    app.get("/serviceById/:id", (req, res) => {
      servicesCollection.find({_id: ObjectId(req.params.id)})
        .toArray((error, documents) => {
            
          res.send(documents[0])
        })
    })

    app.get("/services", (req, res) => {
      servicesCollection.find({})
        .toArray((error, documents) => {

          res.send(documents)
        })
    })


    // app.post("/addReview", (req, res) => {
    //   reviewCollection.insertOne(req.body)
    //   .then(result => {

    //     res.send(result.insertedCount > 0)
    //   })
    // })

    app.post("/addReview", (req, res) => {

      const file = req.files.image;
      const insertData = JSON.parse(req.body.data)

      const newImg = file.data;
      const encodedImg = newImg.toString("base64");
      
      const image = {
          contentType: file.mimetype,
          size: file.size,
          img: Buffer.from(encodedImg, "base64")
      };

      insertData.image = image;
      reviewCollection.insertOne(insertData)
      .then(result => {

        res.send(result.insertedCount > 0)
          
      })

  })













    app.get("/reviews", (req, res) => {
      reviewCollection.find({})
        .toArray((error, documents) => {

          res.send(documents)
        })
    })



    


    /*********** Admin Section *************/

    // add service for an admin
    app.post("/addService", (req, res) => {

        const file = req.files.image;
        const title = req.body.title;
        const description = req.body.description;

        const newImg = file.data;
        const encodedImg = newImg.toString("base64");
        
        const image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encodedImg, "base64")
        };

        servicesCollection.insertOne({title, description, image})
        .then(result => {
            
          res.send(result.insertedCount > 0)
            
        })

    })


    //make an admin
    app.post("/makeAdmin", (req, res) => {

      adminCollection.insertOne(req.body)
      .then(result => {

        res.send(result.insertedCount > 0)
      })

    })

    // for orders list 
    app.get("/allOrders", (req, res) => {
      ordersCollection.find({})
        .toArray((error, documents) => {
  
          // console.log(documents);
          res.send(documents)
        })
    })


    app.patch("/updateSurviceById/:id", (req, res) => {
      
      appointmentsCollection.updateOne({_id: ObjectId(req.params.id)}, {
        $set: {type: req.body.type}
      })
      .then(result => {
        res.send(result.modifiedCount > 0)
      })

    })

    app.get("/admin/:email", (req, res) => {

      adminCollection.find({email: req.params.email})
      .toArray((error, documents) => {

        // console.log(documents, documents.length);
        res.send(documents.length > 0)
      })
    })

    console.log("Database Connected");

});

app.listen(port || process.env.PORT, () => {
  console.log(`Listening at http://localhost:${port}`)
})