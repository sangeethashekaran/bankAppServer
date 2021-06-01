const express = require('express');   //importing express
const session= require('express-session') //importing session
const dataService = require('./Service/data.service.js'); //importing data.service.js file
const app = express();                   //creating app using express module
app.use(express.json());              //parsing json

app.use(session ({                   //session creation in our application
    secret:'randomsecurestring',
    resave:'false',                   //only modified data will save
    saveUninitialized:'false'     //not saving unintialized value
}));

app.use((req,res,next)=>{      //middle ware
console.log("middleware");
next()                       //call next request
});

const logMiddleware=(req,res,next)=>{   //global
    console.log(req.body);
    next();
}
app.use(logMiddleware);

const authMiddleware=(req,res,next)=>{    //used in deposit nd withdraw
    if(!req.session.currentUser) {
        return res.json({                //converting to json
          statusCode:401,
          status:false,
          message:"Please login"
        });
      }
      else{
          next();
      }
}

//GET- read
app.get('/', (req, res) => {
    res.status(401).send("This is GET method");
});

//POST-CREATE
app.post('/', (req, res) => {
    res.send("This is a POST method");
});
app.post('/register',(req,res)=>{
    dataService.register(req.body.uname,req.body.accno,req.body.pswd)  //asychronus action
    .then(result=>{
        res.status(result.statusCode).json(result);
    })
    

});
app.post('/login',(req,res)=>{
    dataService.login(req,req.body.accno,req.body.pswd) //asychronus action ..no semicolon at end
    .then(result=>{
    res.status(result.statusCode).json(result);
})
});

app.post('/deposit',authMiddleware,(req,res)=>{
    console.log(req.session.currentUser);           //currentUser of login
    dataService.deposit(req.body.accno,req.body.pswd,req.body.amount) //asychrons action
    .then(result=>{
    res.status(result.statusCode).json(result);
    })
});
app.post('/withdraw',authMiddleware,(req,res)=>{
    dataService.withdraw(req.body.accno,req.body.pswd,req.body.amount) //asychronus
    .then(result=>{
        res.status(result.statusCode).json(result);
    })
    
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