const cookieSession = require("cookie-session")
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {urlsForUser, checkEmpty, findUserEmail, randomStringGenerator} = require("./helpers")

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

const bodyParser = require("body-parser");
const { response } = require("express");
app.use(bodyParser.urlencoded({extended: true}));


let users = {
  "333": {
    id: "333",
    email: "user@example.com",
    password: bcrypt.hashSync('12345', saltRounds)
  }
}

const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "333"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "333"},
  "999666": {longURL: "https://developer.mozilla.org", userID: "YAL"}
};


app.get("/", (req, res) => {
  res.redirect("/urls");
}); 

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/users.json", (req, res) => {
  res.json(users);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  //console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {username: req.session.userID, user: users[req.session.userID]}
  res.render("urls_new", templateVars);
})

app.get("/urls", (req, res) => {
  let username = null
  let usersLinks = {}
  if (req.session.userID) {
    username = req.session.userID
    usersLinks = urlsForUser(urlDatabase, users[req.session.userID].id);
  }
    
  const templateVars = { urls: usersLinks, user: users[req.session.userID], username };// cookie is stored as username for header
  res.render("urls_index", templateVars);
});

// gets shortURL
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { users, shortURL: req.params.shortURL, user: users[req.session.userID], longURL: urlDatabase[req.params.shortURL], username: req.session.userID};
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
  const shortURL = randomStringGenerator(6)
  const longURL = req.body.longURL
  urlDatabase[shortURL] = {longURL: longURL, userID: users[req.session.userID].id};
  //console.log(urlDatabase)
  res.redirect(`/urls`)
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  //urlDatabase = req.params.shortURL
  res.redirect(longURL);
});

//delet btn
app.post("/urls/:shortURL/delete", (req, res) => {
  const cookieID = req.session.userID
  const urlToDelete = urlDatabase[req.params.shortURL];

  if (cookieID === urlToDelete.userID) {
    delete urlDatabase[req.params.shortURL]
  }
  res.redirect("/urls")
})

// editor
app.post("/urls/:id", (req, res) => {

  const cookieID = req.session.userID
  const shortURL = req.params.id
  const urlToEdit = urlDatabase[shortURL];

  if (cookieID === urlToEdit.userID) {
    urlDatabase[req.params.id].longURL = req.body.longURL
    console.log(urlDatabase)
  }
  
  res.redirect("/urls")
})

app.get("/login", (req, res) => {
  const templateVars = {username: req.session.userID}
  res.render("urls_login", templateVars)
})

app.post("/login", (req, res) => { 
  const user = findUserEmail(users, req.body.email)
  
  checkEmpty(req, res)
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    req.session["userID"] = user.id;
    res.redirect("/urls")
  } else {
    res.status(400);
    res.send("Invalid entry");
  }
})


app.post("/logout", (req, res) => {
  req.session["userID"] = null;
  res.redirect("/")

})
// functional without header or ccs currently
app.get("/register", (req, res) => {
  let templateVars = {username: req.session.userID, user: users[req.session.userID]}
  res.render("urls_register", templateVars)
})

app.post("/register", (req, res) => {
  let userRandomID = randomStringGenerator(3);
  
  

  if (findUserEmail(users, req.body.email)) {
   res.status(400);
   res.send("Invalid entry")
   return
  }
 
 if (checkEmpty(req, res)) {
  users[userRandomID] = {
  id: userRandomID,
  email: req.body.email,
  password: bcrypt.hashSync(req.body.password, saltRounds),
  }
}
  req.session["userID"] = userRandomID;
  //console.log(users)
 
  //console.log(users)
  res.redirect("/")
})

module.exports = {users, urlDatabase}