const db = require('./db');
let accountDetails = {
  1000: { acno: 1000, actype: "savings", username: "userone", password: "userone", balance: 50000 },
  1001: { acno: 1001, actype: "savings", username: "usertwo", password: "usertwo", balance: 5000 },
  1002: { acno: 1002, actype: "current", username: "userthree", password: "userthree", balance: 10000 },
  1003: { acno: 1003, actype: "current", username: "userfour", password: "userfour", balance: 6000 }
}
let curentUser;


const register = (uname, acno, pswd) => {
  return db.User.findOne({ acno })
    .then(user => {
      if (user) {
        return {
          statusCode: 422,
          status: false,
          message: "User exist please login"
        }
      }
      else {
        const newUser = new db.User({    //creating new entry in database
          acno,                             //same format of database
          username: uname,
          password: pswd,
          balance: 0
        })
        newUser.save();                 //saving to db
        return {
          statusCode: 200,
          status: true,
          message: "Successfully registered"
        }
      }
    })

}

const login = (req, accno, password) => {
  var acno = parseInt(accno);
  return db.User.findOne({ acno, password })
    .then(user => {                              //user is result of above return statmnt
      if (user) {
        req.session.currentUser = user; //current users account is assigned in sessions currentUser
        return {
          statusCode: 200,
          status: true,
          message: "login successful"
        }
      }
      else {
        return {
          statusCode: 422,
          status: false,
          message: "Invalid Credentials"
        }
      }
    })

}

const deposit = (acno, password, amt) => {
  //  console.log(req.session.currentUser);

  var amount = parseInt(amt);
  return db.User.findOne({ acno, password })       //asynchronus action
    .then(user => {
      if (!user) {                               //if user is false
        return {
          statusCode: 422,
          status: false,
          message: "Invalid Credentials"
        }
      }
      user.balance += amount;
      user.save();                          //saving balnc to db
      return {
        statusCode: 200,
        status: true,
        balance: user.balance,
        message: amount + " credited and new balance is " + user.balance
      }

    })
}

const withdraw = (acno, password, amt) => {
  var amount = parseInt(amt);
  return db.User.findOne({ acno, password })          //asychronus action
    .then(user => {                                       //for solving resolved state
      if (!user) {
        return {
          statusCode: 422,
          status: false,
          message: "Invalid Credentials"
        }
      }
      if (user.balance < amount) {
        return {
          statusCode: 422,
          status: false,
          message: "Insufficient balance"

        }
      }
      user.balance -= amount;
      user.save();
      return {
        statusCode: 200,
        status: true,
        balance: user.balance,
        message: amount + " depicted and new balance is " + user.balance
      }
    })
  }

 


module.exports = {
  register,
  login,
  deposit,
  withdraw
}