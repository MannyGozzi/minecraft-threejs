require('dotenv').config()

const express = require("express");
const app = express();

app.use(express.static("public"));

app.get("/", function(request, response) {
  response.render('index');
});

const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
