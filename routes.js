/*
Hello! This is a learning API for the Postman APIs 101 webinar. Check out the template: 
*/

var xml = require("xml");

var low = require("lowdb");
var FileSync = require("lowdb/adapters/FileSync");
var adapter = new FileSync(".data/db.json");
var db = low(adapter);

db.defaults({
  customers: [
    { id: 1, name: "Blanche Devereux", type: "Individual", admin: "postman" },
    { id: 2, name: "Rose Nylund", type: "Individual", admin: "postman" },
    { id: 3, name: "Shady Pines", type: "Company", admin: "postman" }
  ]
}).write();

var routes = function(app) {
  //
  // This route processes GET requests, by using the `get()` method in express, and we're looking for them on
  // the root of the application (in this case that's https://rest-api.glitch.me/), since we've
  // specified `"/"`.  For any GET request received at "/", we're sending some HTML back and logging the
  // request to the console. The HTML you see in the browser is what `res.send()` is sending back.
  //
  app.get("/", function(req, res) {
    res.send(
      "<h1>REST API</h1><p>Oh, hi! There's not much to see here - view the code instead</p>" +
        '<script src="https://button.glitch.me/button.js" data-style="glitch"></script><div class="glitchButton" style="position:fixed;top:20px;right:20px;"></div>'
    );
    console.log("Received GET");
  });

  //get request with query param
  app.get("/customer", function(req, res) {
    if (!req.query.id) {
      return res.send({ status: "error", message: "no id" });
    } else {
      res.status(200).json({
        id: 1,
        name: "Blanche Devereux",
        type: "Individual"
      });
    }
  });

  //get all users
  app.get("/customers", function(req, res) {
    console.log(req.get("user-id"));
    var customers = db
      .get("customers")
      .filter(c => c.admin === "postman" || c.admin === req.get("user-id"))
      .value()
      .map(r => {
        return { id: r.id, name: r.name, type: r.type };
      });
    res.status(200).json({
    "welcome": "Welcome to APIs 101! Check out the 'data' object below to see the values returned by the API. Click Visualize for a more "+
        "readable view of the response.",
    "data": {
        "customers": customers
    },
    "tutorial": {
        "title": "You sent a request! 🚀",
        "intro": "Your request used `GET` method and sent to the `/customers` path.",
        "steps": [
            {
                "note": "The API returned JSON data including an array of customers:",
                "raw_data": {
                    "customers": customers
                }
            }
        ],
        "next": [
            {
                "step": "Now open the next request in the collection `Get one customer` and click **Send**."
            }
        ]
    }
});
  });

  //add new user
  app.post("/customer", function(req, res) {
    const apiSecret = req.get("auth_key");
    if (!apiSecret)
      res.status(401).json({ error: "You need to supply an auth key!" });
    else if (!req.body.name)
      return res.send({ status: "error", message: "no name" });
    else if (!req.body.type)
      return res.send({ status: "error", message: "no type" });
    else res.status(201).json({ status: "customer added" });
  });

  //update user
  app.patch("/customer", function(req, res) {
    const apiSecret = req.get("auth_key");
    if (!apiSecret)
      res.status(401).json({ error: "You need to supply an auth key!" });
    if (!req.body.name)
      return res.send({ status: "error", message: "no name" });
    else if (!req.body.type)
      return res.send({ status: "error", message: "no type" });
    else res.status(201).json({ status: "customer updated" });
  });

  //protect everything after this by checking for the secret
  app.use((req, res, next) => {
    const apiSecret = req.get("admin_key");
    if (!apiSecret || apiSecret !== process.env.SECRET) {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      next();
    }
  });

  // removes entries from users and populates it with default users
  app.get("/reset", (request, response) => {
    // removes all entries from the collection
    db.get("customers")
      .remove()
      .write();
    console.log("Database cleared");

    // default users inserted in the database
    var customers = [
      { id: 1, name: "Blanche Devereux", type: "Individual", admin: "postman" },
      { id: 2, name: "Rose Nylund", type: "Individual", admin: "postman" },
      { id: 3, name: "Shady Pines", type: "Company", admin: "postman" }
    ];

    customers.forEach(customer => {
      db.get("customers")
        .push({
          id: customer.id,
          name: customer.name,
          type: customer.type,
          admin: customer.admin
        })
        .write();
    });
    console.log("Default customers added");
    response.redirect("/");
  });

  // removes all entries from the collection
  app.get("/clear", (request, response) => {
    // removes all entries from the collection
    db.get("customers")
      .remove()
      .write();
    console.log("Database cleared");
    response.redirect("/");
  });
};

module.exports = routes;
