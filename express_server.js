const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');

app.set("view engine", "ejs");
app.use(cookieParser());

const randomStringGenerator = (input) => {
  let result = [];
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789";
  for (let i = 0; i < input; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * characters.length)));
  }
  console.log(typeof result.join(''))
  return result.join('');
}

const bodyParser = require("body-parser");
const { response } = require("express");
app.use(bodyParser.urlencoded({extended: true}));




let users = {
  "333": {
    id: "333",
    email: "user@example.com",
    password: "12345"
  }
}

const checkDuplicate = (email) => {
  for (let userID in users) {
console.log("check duplicate", users[userID].email)
    if (users[userID].email.toLowerCase() === email.toLowerCase()) {
    return users[userID];
    }
  }
  return false;
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
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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
  const templateVars = { urls: urlDatabase, user: users[req.cookies.userID], username: req.cookies.userID };// cookie is stored as username for header
  //console.log("this is cookie value: ", req.cookies.userID)
  res.render("urls_index", templateVars);
});

// gets shortURL
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { users, shortURL: req.params.shortURL, user: users[req.cookies.userID], longURL: urlDatabase[req.params.shortURL], username: req.cookies.userID};
  //urlDatabase.keyValues = templateVars
  //console.log(req.params)
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
    // Log the POST request body to the console
    // Respond with 'Ok' (we will replace this)ß
  const shortURL = randomStringGenerator(6)
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`)
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  //urlDatabase = req.params.shortURL
  res.redirect(longURL);
});

//delet btn
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls")
})

// editor
app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL
  res.redirect("/urls")
})

app.get("/login", (req, res) => {
  const templateVars = {username: req.cookies.userID}
  res.render("urls_login", templateVars)
})

app.post("/login", (req, res) => {
  const userCheck = checkDuplicate(req.body.email);

  if (!userCheck) {
      res.status(403);
      res.send("Invalid entry")
    } 
  
  if (userCheck.password !== req.body.password) {
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

  if (checkDuplicate(req.body.email)) {
   res.status(400);
   res.send("Invalid entry")
   return
  }
 
 
 
  users[userRandomID] = {
  id: userRandomID,
  email: req.body.email,
  password: req.body.password
  }
  res.cookie("userID", userRandomID);
 //console.log(users)
 
  console.log(users)
  res.redirect("/")
})

