const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const require('dotenv').config();
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lastname;
  const email = req.body.email;
  console.log(firstName);
  console.log(lastName);
  console.log(email);

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };
  const jsonData = JSON.stringify(data);
const url = process.env.API_URL;
  const options = {
    method: "post",
    auth: process.env.MAIL_AUTH
  };


  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "/failure.html")
    }


    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });


  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("You are up and running");
});
