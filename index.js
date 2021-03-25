const express = require('express');
const MongoClient = require('mongodb').MongoClient;

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
      console.log("todos body");
      collection.insertOne(todos)
      .then(result =>{
          console.log("todos added");
          //res.send('add success');
          res.redirect('/');
      })
  })

});




















app.listen(3000,()=>{
    console.log('Server run on 3000 port!');
})