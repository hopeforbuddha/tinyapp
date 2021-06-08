const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const randomStringGenerator = () => {
  let result = [];
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789";
  for (let i = 0; i < 6; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * characters.length)));
  }
  return result.join('');
}

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

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
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
})

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// gets shortURL
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  //urlDatabase.keyValues = templateVars
  console.log(req.params)
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
    // Log the POST request body to the console
    // Respond with 'Ok' (we will replace this)ß
  const shortURL = randomStringGenerator()
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`)
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  //urlDatabase = req.params.shortURL
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls")
})

// editor
app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL
  res.redirect("/urls")
})