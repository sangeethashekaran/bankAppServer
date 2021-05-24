const express = require('express');   //importing express
const app = express();                 //creating app using express module

//GET- read
app.get('/', (req, res) => {
    res.status(401).send("This is GET method");
});

//POST-CREATE
app.post('/', (req, res) => {
    res.send("This is a POST method");
});

//PUT -Update/modify whole
app.put('/', (req, res) => {
    res.send("This is a PUT method");
});

//PATCH-Update/modify partially
app.patch('/', (req, res) => {
    res.send("This is a PATCH method");
});

//DELETE
app.delete('/', (req, res) => {
    res.send("This is a DELETE method");
});



app.listen(3000, () => {            //server  listening to port 3000
    console.log("Server created at port:3000");
});