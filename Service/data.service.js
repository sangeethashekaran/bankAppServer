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

const deposit = (accno, pswd, amt) => {
  //  console.log(req.session.currentUser);

  var amount = parseInt(amt);
  let user = accountDetails;
  if (accno in user) {
    if (pswd == user[accno]["password"]) {
      user[accno]["balance"] += amount;
      return {
        statusCode: 200,
        status: true,
        balance: user[accno]["balance"],
        message: amount + " credited and new balance is " + user[accno]["balance"]
      }
      // return user[accno]["balance"];
    }
    else {
      return {
        statusCode: 422,
        status: false,
        message: "Incorrect Password"
      }
    }
  }

  else {
    return {
      statusCode: 422,
      status: false,
      message: "Invalid Account"
    }
  }
}

const withdraw = (accno, pswd, amt) => {
  var amount = parseInt(amt);

  let users = accountDetails;

  if (accno in users) {
    if (pswd == users[accno]["password"]) {
      if (users[accno]["balance"] > amount) {
        users[accno]["balance"] -= amount;
        return {
          statusCode: 200,
          status: true,
          balance: users[accno]["balance"],
          message: amount + " depicted and new balance is " + users[accno]["balance"]
        }
      }

      else {

        return {
          statusCode: 422,
          status: false,
          message: "Insufficient balance"

        }
      }
    }
    else {

      return {
        statusCode: 422,
        status: false,
        message: "Incorrect Password"

      }
    }
  }
  else {
    return {
      statusCode: 422,
      status: false,
      message: "Invalid Account"
    }

  }
}




module.exports = {
  register,
  login,
  deposit,
  withdraw

}