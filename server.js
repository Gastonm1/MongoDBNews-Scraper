var express = require("express");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://news.ycombinator.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      // Now, we grab every h2 within an article tag, and do the following:
      $(".itemlist tbody").each(function(i, element) {
        //   console.log(element)

        // Save an empty result objectc
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("tr")
          .text();
          console.log(result.title.split("\n"))
        // result.link = $(this)
        //   .children("a")
        //   .attr("href");
  
        // Create a new Article using the `result` object built from scraping
        // db.Article.create(result)
        //   .then(function(dbArticle) {
        //     // View the added result in the console
        //     console.log(dbArticle);
        //   })
        //   .catch(function(err) {
        //     // If an error occurred, log it
        //     console.log(err);
        //   });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });


// Start the server

app.listen(PORT, function(err){

    if (err) {
        throw err;
    }
    console.log("https://localhost:" + PORT);
});