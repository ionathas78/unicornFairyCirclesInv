const express = require("express");
const dotenv = require("dotenv");
const app = express();
const https = require("https");

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const _CORS_SERVER = "https://polar-bayou-73801.herokuapp.com/";
const _PLACEHOLDER_IMAGE = "http://via.placeholder.com/100";

// Root get route
app.get("/", function(req, res) {res.status(200).end()});

app.get("/inv", function(req, res) {
 
  var queryString = `https://inventory.zoho.com/api/v1/items?authtoken=${process.env.AUTH}&organization_id=${process.env.ORG}`
  sendAjax_CORS(queryString);

  function sendAjax_CORS(queryString) {
    queryString = _CORS_SERVER + queryString;

    https.get(queryString, resp => {
      let itemArray = [];

      if (!resp || !resp.items) {
        console.log(resp);
        res.status(503).end();
      };

      for (let i = 0; i < resp.items.length; i++) {
          let item = resp.items[i];

          if ((item !== undefined) && 
                      (item.item_name.toLowerCase().indexOf("buttons") > -1)) {
              itemArray.push({
                  name: item.item_name,
                  SKU: item.sku,
                  // image: "./images/" + item.sku + ".jpg",
                  image: _PLACEHOLDER_IMAGE,
                  stock: item.available_stock,
                  unit: item.unit
              });
          };
      };
      
      itemArray.sort((itemA, itemB) => itemA.sku > itemB.sku);

      res.json(JSON.stringify(itemArray));
    });
  };
});

  // Post route -> back to home
// app.post("/", function(req, res) {
//     res.redirect("/");
// });

// Start our server so that it can begin listening to client requests.
app.listen(PORT, () => {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
