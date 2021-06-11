
const bcrypt = require('bcrypt');

const randomStringGenerator = (input) => {
  let result = [];
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789";
  for (let i = 0; i < input; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * characters.length)));
  }
  return result.join('');
}

const findUserEmail = (users, email) => {
  for (let userID in users) {
    if (users[userID].email === email) {
    return users[userID];
    }
  }
  return false;
}

//const authUser = (email, password) => {
//  const user = findUserEmail(email)
//
//  if (user && bcrypt.compareSync(password, user.password)) {
//    return user
//  } else {
//    return false
//  }
//}

const checkEmpty = (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.status(400);
    res.send("Invalid entry");
    return false
  }
  return true
}

const urlsForUser = (urlDatabase ,id) => {
  let urls = {}
  for (const key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      urls[key] = urlDatabase[key]
    }
  }
  return urls
}

 module.exports = {urlsForUser, checkEmpty, findUserEmail, randomStringGenerator}