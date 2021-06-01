const mongoose=require('mongoose');          //importing mongoose in our app
mongoose.connect('mongodb://localhost:27017/bankApp',{     //connceting server and db using mongoose
    useNewUrlParser:true,
    useUnifiedTopology: true 
})

const User = mongoose.model('User',{       //mongoose model
    acno:Number,                          //schema
    username:String,
    password:String,
    balance:Number
})

module.exports={
    User
}