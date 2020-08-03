/*
Hello! This is a learning API for the Postman APIs 101 webinar. Check out the template: 
*/

var xml = require("xml");

var low = require("lowdb");
var FileSync = require("lowdb/adapters/FileSync");
var adapter = new FileSync(".data/db.json");
var db = low(adapter);
const shortid = require("shortid");

db.defaults({
  customers: [
    {
      id: "123abc",
      name: "Blanche Devereux",
      type: "Individual",
      admin: "postman"
    },
    {
      id: shortid.generate(),
      name: "Rose Nylund",
      type: "Individual",
      admin: "postman"
    },
    {
      id: shortid.generate(),
      name: "Shady Pines",
      type: "Company",
      admin: "postman"
    }
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
      res.status(404).json({
        welcome:
          "You're learning APIs 101! Check out the 'data' object below to see the values returned by the API. Click Visualize for a more " +
          "readable view of the response.",
        tutorial: {
          title: "Your request is missing some info! 😕",
          intro: "This endpoint requires you to specify a customer.",
          steps: [
            {
              note:
                "In **Params** add `id` in the **Key** column, and one of the `id` values from the customer list as the **Value**, " +
                "for example `123abc`."
            }
          ],
          next: [
            {
              step:
                "With your parameter in place (you'll see e.g. `?id=123abc` added to the request address), click **Send** again."
            }
          ]
        }
      });
    } else {
      var customerRecord = db
        .get("customers")
        .find({ id: parseInt(req.query.id) })
        .value();
      console.log(customerRecord);
      if (customerRecord) {
        var customer = {
          id: customerRecord.id,
          name: customerRecord.name,
          type: customerRecord.type
        };
        res.status(200).json({
          welcome:
            "You're learning APIs 101! Check out the 'data' object below to see the values returned by the API. Click Visualize for a more " +
            "readable view of the response.",
          data: {
            customer: customer
          },
          tutorial: {
            title: "You sent a request with a query parameter! 🎉",
            intro:
              "Your request used the `id` parameter to retrieve a specific customer.",
            steps: [
              {
                note:
                  "The API returned a JSON object representing the customer:",
                raw_data: {
                  customer: customer
                }
              }
            ],
            next: [
              {
                step:
                  "Now open the next request in the collection `POST Add new customer` and click **Send**."
              }
            ]
          }
        });
      } else {
        res.status(404).json({
          welcome:
            "You're learning APIs 101! Check out the 'data' object below to see the values returned by the API. Click Visualize for a more " +
            "readable view of the response.",
          tutorial: {
            title: "Your request contains invalid info! 😕",
            intro: "This endpoint requires the `id` for a valid customer.",
            steps: [
              {
                note:
                  "In **Params** add `id` in the **Key** column, and `1` as the value."
              }
            ],
            next: [
              {
                step:
                  "With your parameter in place (you'll see `?id=1` added to the request address), click **Send** again."
              }
            ]
          }
        });
      }
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
      welcome:
        "Welcome to APIs 101! Check out the 'data' object below to see the values returned by the API. Click Visualize for a more " +
        "readable view of the response.",
      data: {
        customers: customers
      },
      tutorial: {
        title: "You sent a request! 🚀",
        intro:
          "Your request used `GET` method and sent to the `/customers` path.",
        steps: [
          {
            note: "The API returned JSON data including an array of customers:",
            raw_data: {
              customers: customers
            }
          }
        ],
        next: [
          {
            step:
              "Now open the next `GET` request in the collection `Get one customer` and click **Send**."
          }
        ]
      }
    });
  });

  //add new user
  app.post("/customer", function(req, res) {
    const apiSecret = req.get("auth_key");
    if (!apiSecret)
      res.status(401).json({
        welcome:
          "You're learning APIs 101! Check out the 'data' object below to see the values returned by the API. Click Visualize for a more " +
          "readable view of the response.",
        tutorial: {
          title: "Your request is unauthorized! 🚫",
          intro: "This endpoint requires authentication.",
          steps: [
            {
              note:
                "In **Auth** select **API Key** from the drop-down, enter `auth_key` as the **Key** and any text you like as the **Value**. " +
                "Make sure you are adding to the **Header**."
            }
          ],
          next: [
            {
              step: "With your auth key in place, click **Send** again."
            }
          ]
        }
      });
    else if (!req.body.name || !req.body.type)
      res.status(400).json({
        welcome:
          "You're learning APIs 101! Check out the 'data' object below to see the values returned by the API. Click Visualize for a more " +
          "readable view of the response.",
        tutorial: {
          title: "Your request is incomplete! ✋",
          intro:
            "This endpoint requires body data representing the new customer.",
          steps: [
            {
              note:
                "In **Body** select **raw** and choose **JSON** instead of `Text` in the drop-down list. Enter the following JSON data " +
                "including the enclosing curly braces:",
              raw_data: {
                name: "Dorothy Zpornak",
                type: "Individual"
              }
            }
          ],
          next: [
            {
              step: "With your body data in place, click **Send** again."
            }
          ]
        }
      });
    else {
      var adminId = req.get("user-id") ? req.get("user-id") : "anonymous";
      db.get("customers")
        .push({
          id: shortid.generate(),
          name: req.body.name,
          type: req.body.type,
          admin: adminId
        })
        .write();
      res.status(201).json({
        welcome:
          "You're learning APIs 101! Check out the 'data' object below to see the values returned by the API. Click Visualize for a more " +
          "readable view of the response.",
        tutorial: {
          title: "You added a new customer! 🏅",
          intro: "Your new customer was added to the database.",
          steps: [
            {
              note:
                "Go back into the first request you opened `Get all customers` and **Send** it again before returning here—" +
                "you should see your new addition in the array!"
            }
          ],
          next: [
            {
              step:
                "Next open the `PUT Update customer` request and click **Send**."
            }
          ]
        }
      });
    }
  });

  //update user
  app.put("/customer/:cust_id", function(req, res) {
    const apiSecret = req.get("auth_key");
    if (!apiSecret)
      res.status(401).json({
        welcome:
          "You're learning APIs 101! Check out the 'data' object below to see the values returned by the API. Click Visualize for a more " +
          "readable view of the response.",
        tutorial: {
          title: "Your request is unauthorized! 🚫",
          intro: "This endpoint requires authentication.",
          steps: [
            {
              note:
                "In **Auth** select **API Key** from the drop-down, enter `auth_key` as the **Key** and any text you like as the **Value**. " +
                "Make sure you are adding to the **Header**."
            }
          ],
          next: [
            {
              step: "With your auth key in place, click **Send** again."
            }
          ]
        }
      });
    else if (req.params.cust_id == "placeholder")
      res.status(400).json({
        welcome:
          "You're learning APIs 101! Check out the 'data' object below to see the values returned by the API. Click Visualize for a more " +
          "readable view of the response.",
        tutorial: {
          title: "Your request is incomplete! ✋",
          intro:
            "This endpoint requires an ID representing the customer to update.",
          steps: [
            {
              note:
                "This requests includes a path parameter with `/:customer_id` at the end of the request address—open **Params** and replace . " +
                "`placeholder` with the `id` of a customer you added when you sent the `POST` request. Copy the `id` from the response in the " +
                "`Get all customers` request. ***You can only update a customer you added.***"
            }
          ],
          next: [
            {
              step:
                "With your customer ID parameter in place, click **Send** again."
            }
          ]
        }
      });
    else if (!req.body.name || !req.body.type)
      res.status(400).json({
        welcome:
          "You're learning APIs 101! Check out the 'data' object below to see the values returned by the API. Click Visualize for a more " +
          "readable view of the response.",
        tutorial: {
          title: "Your request is incomplete! ✋",
          intro:
            "This endpoint requires body data representing the new customer.",
          steps: [
            {
              note:
                "In **Body** select **raw** and choose **JSON** instead of `Text` in the drop-down list. Enter the following JSON data " +
                "including the enclosing curly braces:",
              raw_data: {
                name: "Sophia Petrillo",
                type: "Individual"
              }
            }
          ],
          next: [
            {
              step: "With your body data in place, click **Send** again."
            }
          ]
        }
      });
    else {
      var adminId = req.get("user-id") ? req.get("user-id") : "anonymous";
      db.get("customers")
        .find({ id: req.params.cust_id })
        .assign({ name: req.body.name, type: req.body.type, admin: adminId })
        .write();
      res.status(201).json({
        welcome:
          "You're learning APIs 101! Check out the 'data' object below to see the values returned by the API. Click Visualize for a more " +
          "readable view of the response.",
        tutorial: {
          title: "You updated a customer! ✅",
          intro: "Your customer was updated in the database.",
          steps: [
            {
              note:
                "Go back into the first request you opened `Get all customers` and **Send** it again before returning here—" +
                "you should see your updated customer in the array!"
            }
          ],
          next: [
            {
              step:
                "Next open the `DEL Remove customer` request and click **Send**."
            }
          ]
        }
      });
    }
  });
  
  
  //update user
  app.delete("/customer/:cust_id", function(req, res) {
    const apiSecret = req.get("auth_key");
    if (!apiSecret)
      res.status(401).json({
        welcome:
          "You're learning APIs 101! Check out the 'data' object below to see the values returned by the API. Click Visualize for a more " +
          "readable view of the response.",
        tutorial: {
          title: "Your request is unauthorized! 🚫",
          intro: "This endpoint requires authentication.",
          steps: [
            {
              note:
                "In **Auth** select **API Key** from the drop-down, enter `auth_key` as the **Key** and any text you like as the **Value**. " +
                "Make sure you are adding to the **Header**."
            }
          ],
          next: [
            {
              step: "With your auth key in place, click **Send** again."
            }
          ]
        }
      });
    else if (req.params.cust_id == "placeholder")
      res.status(400).json({
        welcome:
          "You're learning APIs 101! Check out the 'data' object below to see the values returned by the API. Click Visualize for a more " +
          "readable view of the response.",
        tutorial: {
          title: "Your request is incomplete! ✋",
          intro:
            "This endpoint requires an ID representing the customer to update.",
          steps: [
            {
              note:
                "This requests includes a path parameter with `/:customer_id` at the end of the request address—open **Params** and replace . " +
                "`placeholder` with the `id` of a customer you added when you sent the `POST` request. Copy the `id` from the response in the " +
                "`Get all customers` request. ***You can only update a customer you added.***"
            }
          ],
          next: [
            {
              step:
                "With your customer ID parameter in place, click **Send** again."
            }
          ]
        }
      });
    else if (!req.body.name || !req.body.type)
      res.status(400).json({
        welcome:
          "You're learning APIs 101! Check out the 'data' object below to see the values returned by the API. Click Visualize for a more " +
          "readable view of the response.",
        tutorial: {
          title: "Your request is incomplete! ✋",
          intro:
            "This endpoint requires body data representing the new customer.",
          steps: [
            {
              note:
                "In **Body** select **raw** and choose **JSON** instead of `Text` in the drop-down list. Enter the following JSON data " +
                "including the enclosing curly braces:",
              raw_data: {
                name: "Sophia Petrillo",
                type: "Individual"
              }
            }
          ],
          next: [
            {
              step: "With your body data in place, click **Send** again."
            }
          ]
        }
      });
    else {
      var adminId = req.get("user-id") ? req.get("user-id") : "anonymous";
      db.get("customers")
        .find({ id: req.params.cust_id })
        .assign({ name: req.body.name, type: req.body.type, admin: adminId })
        .write();
      res.status(201).json({
        welcome:
          "You're learning APIs 101! Check out the 'data' object below to see the values returned by the API. Click Visualize for a more " +
          "readable view of the response.",
        tutorial: {
          title: "You updated a customer! ✅",
          intro: "Your customer was updated in the database.",
          steps: [
            {
              note:
                "Go back into the first request you opened `Get all customers` and **Send** it again before returning here—" +
                "you should see your updated customer in the array!"
            }
          ],
          next: [
            {
              step:
                "Next open the `DEL Remove customer` request and click **Send**."
            }
          ]
        }
      });
    }
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
      {
        id: "123abc",
        name: "Blanche Devereux",
        type: "Individual",
        admin: "postman"
      },
      {
        id: shortid.generate(),
        name: "Rose Nylund",
        type: "Individual",
        admin: "postman"
      },
      {
        id: shortid.generate(),
        name: "Shady Pines",
        type: "Company",
        admin: "postman"
      }
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
