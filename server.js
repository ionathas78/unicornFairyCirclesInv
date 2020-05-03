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

const _CORS_SERVER = "://polar-bayou-73801.herokuapp.com/";
const _PLACEHOLDER_IMAGE = "://via.placeholder.com/100";

// Root get route
app.get("/", function(req, res) {res.status(200).send("server listening on PORT:" + PORT)});

app.get("/inv", function(req, res) {
  var queryString = `${req.protocol}://inventory.zoho.com/api/v1/items?q=button&authtoken=${process.env.AUTH}&organization_id=${process.env.ORG}`
  console.log(queryString);
  // sendAjax_CORS(queryString);
  // sendAjax_CORS('https://inventory.zoho.com/api/v1/items?authtoken=${process.env.AUTH}&organization_id=${process.env.ORG}');

  https.get("https" + _CORS_SERVER + queryString, resp => {
    let itemArray = [];
    // console.log(resp);

    if (!resp || !resp.items) {
      res.status(503).send("No luck...");
    };

    for (let i = 0; i < resp.items.length; i++) {
        let item = resp.items[i];

        if ((item !== undefined) && 
                    (item.item_name.toLowerCase().indexOf("buttons") > -1)) {
            itemArray.push({
                name: item.item_name,
                SKU: item.sku,
                image: "./images/" + item.sku + ".jpg",
                // image: req.protocol + _PLACEHOLDER_IMAGE,
                stock: item.available_stock,
                unit: item.unit
            });
        };
    };
    
    itemArray.sort((itemA, itemB) => itemA.sku > itemB.sku);

    res.json(JSON.stringify(itemArray));
});


// Start our server so that it can begin listening to client requests.
app.listen(PORT, () => {
  // Log (server-side) when our server has started
  console.log(`Server listening on: https://peaceful-caverns-19894.herokuapp.com:${PORT && process.env.PORT}`);
});

function sendAjax_CORS(queryString) {
  let queryURL = req.protocol + _CORS_SERVER + queryString;
  console.log(queryURL);

  https.get("https" + _CORS_SERVER + queryString, resp => {
    let itemArray = [];
    // console.log(resp);

    if (!resp || !resp.items) {
      res.status(503).send("No luck...");
    };

    for (let i = 0; i < resp.items.length; i++) {
        let item = resp.items[i];

        if ((item !== undefined) && 
                    (item.item_name.toLowerCase().indexOf("buttons") > -1)) {
            itemArray.push({
                name: item.item_name,
                SKU: item.sku,
                image: "./images/" + item.sku + ".jpg",
                // image: req.protocol + _PLACEHOLDER_IMAGE,
                stock: item.available_stock,
                unit: item.unit
            });
        };
    };
    
    itemArray.sort((itemA, itemB) => itemA.sku > itemB.sku);

    res.json(JSON.stringify(itemArray));
  });
};