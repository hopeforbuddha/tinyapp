const cookieSession = require("cookie-session")
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cookieParser = require("cookie-parser")

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(cookieParser())
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

const randomStringGenerator = (input) => {
  let result = [];
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789";
  for (let i = 0; i < input; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * characters.length)));
  }
  return result.join('');
}

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

const findUserEmail = (email) => {
  for (let userID in users) {
    if (users[userID].email === email) {
    return users[userID];
    }
  }
  return false;
}

const authUser = (email, password) => {
  const user = findUserEmail(email)

  if (user && bcrypt.compareSync(password, user.password)) {
    return user
  } else {
    return false
  }
}

// FIX THIS NOT STOPING FROM SAVING IF THERE IS A BLANK
// FIX THIS NOT STOPING FROM SAVING IF THERE IS A BLANK
// FIX THIS NOT STOPING FROM SAVING IF THERE IS A BLANK
const checkEmpty = (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400);
    res.send("Invalidy entry");
    return false
  }
  return true
}

const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "333"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "333"},
  "999666": {longURL: "https://developer.mozilla.org", userID: "YAL"}
};

//checks urldatabase for matching userID so that only the owners of the urls can see and edit them
const urlsForUser = (id) => {
  let urls = {}
  for (const key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      urls[key] = urlDatabase[key]
    }
  }
  return urls
}


app.get("/", (req, res) => {
  res.redirect("/urls");
}); 

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  //console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {username: req.cookies.userID, user: users[req.cookies.userID]}
  res.render("urls_new", templateVars);
})

app.get("/urls", (req, res) => {
  let username = null
  let usersLinks = {}
  if (req.cookies.userID) {
    username = req.cookies.userID
    usersLinks = urlsForUser(users[req.cookies.userID].id);
  }
    
  const templateVars = { urls: usersLinks, user: users[req.cookies.userID], username };// cookie is stored as username for header
  res.render("urls_index", templateVars);
});

// gets shortURL
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { users, shortURL: req.params.shortURL, user: users[req.cookies.userID], longURL: urlDatabase[req.params.shortURL], username: req.cookies.userID};
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
  const shortURL = randomStringGenerator(6)
  const longURL = req.body.longURL
  urlDatabase[shortURL] = {longURL: longURL, userID: users[req.cookies.userID].id};
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
  const cookieID = req.cookies.userID
  const urlToDelete = urlDatabase[req.params.shortURL];

  if (cookieID === urlToDelete.userID) {
    delete urlDatabase[req.params.shortURL]
  }
  res.redirect("/urls")
})

// editor
app.post("/urls/:id", (req, res) => {

  const cookieID = req.cookies.userID
  const shortURL = req.params.id
  const urlToEdit = urlDatabase[shortURL];

  if (cookieID === urlToEdit.userID) {
    urlDatabase[req.params.id].longURL = req.body.longURL
    console.log(urlDatabase)
  }
  
  res.redirect("/urls")
})

app.get("/login", (req, res) => {
  const templateVars = {username: req.cookies.userID}
  res.render("urls_login", templateVars)
})

app.post("/login", (req, res) => {
  const userCheck = findUserEmail(req.body.email);

  if (!userCheck) {
      res.status(403);
      res.send("Invalid entry")
    } 
  //userCheck.password !== 
  if (authUser(userCheck, req.body.password)) {
    res.status(403);
    res.send("Invalid entry")
  }

  
  res.cookie("userID", userCheck.id)
  
  res.redirect("/urls")
})


app.post("/logout", (req, res) => {
  res.clearCookie("userID")
  res.redirect("/")

})
// functional without header or ccs currently
app.get("/register", (req, res) => {
  let templateVars = {username: req.cookies.userID, user: users[req.cookies.userID]}
  res.render("urls_register", templateVars)
})

app.post("/register", (req, res) => {
  let userRandomID = randomStringGenerator(3);
  checkEmpty(req, res)

  if (findUserEmail(req.body.email)) {
   res.status(400);
   res.send("Invalid entry")
   return
  }
 
 
 
  users[userRandomID] = {
  id: userRandomID,
  email: req.body.email,
  password: bcrypt.hashSync(req.body.password, saltRounds),
  }
  res.cookie("userID", userRandomID);
 console.log(users)
 
  //console.log(users)
  res.redirect("/")
})

