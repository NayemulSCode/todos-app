const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const uri = "mongodb+srv://todosUser:todosUser1234@cluster0.uuafy.mongodb.net/todosdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req,res) =>{
    res.sendFile(__dirname + '/index.html');
})


client.connect(err => {
  const collection = client.db("todosdb").collection("todos");
  // create todos
  app.post('/addTodos', (req, res) => {
      const todos = req.body;
      collection.insertOne(todos)
      .then(result =>{
          console.log("todos added");
          //res.send('add success');
          res.redirect('/');
      })
  })
  //read to frontend
  app.get('/todos',(req,res) =>{
      collection.find({}).limit(20)
      .toArray((err, results) =>{
          res.send(results);
      })
  })
  //load single todos send for editable form
  app.get('/todo/:id',(req, res) =>{
    collection.find({_id: ObjectId(req.params.id)})
    .toArray((err, result) =>{
      res.send(result[0]);
    })
  })
  //update todos
  app.patch('/update/:id',(req,res) =>{
    collection.updateOne({_id: ObjectId(req.params.id)},{
      $set: {name: req.body.name}
    })
    .then(result =>{
      res.send(result.modifiedCount>0);
    })
  })
  //delete todos
  app.delete('/delete/:id',(req,res) =>{
      collection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result =>{
          res.send(result.deletedCount>0);
      })
  })
});




















app.listen(3000,()=>{
    console.log('Server run on 3000 port!');
})