/*
Hello! This is a learning API for the Postman API 101 webinar. Check out the template: https://explore.postman.com/templates/11317/api-101
*/

var xml = require("xml");

var low = require("lowdb");
var FileSync = require("lowdb/adapters/FileSync");
var adapter = new FileSync(".data/db.json");
var db = low(adapter);
const faker = require('faker');

db.defaults({
  learners: [
    {
      id: 1,
      email: "sue.smith@postman.com",
      methods: 1,
      bodies: 0,
      auth: 0,
      vars: 0,
      script: 1,
      rand: "Sue"
    }
  ],
  count: 1,
  calls: []
}).write();
//email is query param
//template includes unresolved var

var routes = function(app) {
  //
  // This route processes GET requests, by using the `get()` method in express, and we're looking for them on
  // the root of the application (in this case that's https://rest-api.glitch.me/), since we've
  // specified `"/"`.  For any GET request received at "/", we're sending some HTML back and logging the
  // request to the console. The HTML you see in the browser is what `res.send()` is sending back.
  //
  app.get("/", function(req, res) {
    var newDate = new Date();
    db.get("calls")
      .push({
        when: newDate.toDateString() + " " + newDate.toTimeString(),
        where: "GET /"
      })
      .write();
    res.status(200).json({
      message:
        "Use the API 101 template in Postman to learn API basics! Import the collection in Postman by clicking " +
        "New > Templates, and searching for 'API 101'. Open the first request in the collection and click Send. " +
        "To see the API code navigate to https://glitch.com/edit/#!/api-101 in your web browser"
    });
    console.log("Received GET");
  });

  var welcomeMsg =
    "You're using the Postman Skill Checker! " +
    "Click Visualize for a more readable view of the response.";

  app.get("/skills", function(req, res) {
    var newDate = new Date();
    db.get("calls")
      .push({
        when: newDate.toDateString() + " " + newDate.toTimeString(),
        where: "GET /skills",
        what: req.get("user-id")
      })
      .write();

    var existing = db
      .get("learners")
      .find({ id: req.get("user-id") })
      .value();
    let learner = {};
    if (existing) {
      let email="-", bodies=0, methods=0, auth=0, vars=0, script=0; console.log(req.query.email)
      if(req.query.email && req.q.length>0) email=req.query.email;
      if(req.body.name) bodies=1;
      //methods will be any other than get
      if(req.get("auth_key")) auth=1;
      if(req.get("course").indexOf('{{')<0) vars=1;
      if(req.get("response-value")==existing.rand) script=1;
      learner={email: email, methods: methods, bodies: bodies, auth: auth, vars: vars, script: script, rand: existing.rand};
      db
      .get("learners")
      .find({ id: req.get("user-id") })
      .assign(learner)
          .write();
          
    } else {
      learner={id: req.get("user-id"), email: "-", methods: 0, bodies: 0, auth: 0, vars: 0, script: 0, rand: faker.name.firstName()};
      db.get("learners")
        .push(learner)
        .write();
    }
    console.log("rand "+learner.rand)
    res.status(400).json({
      welcome: welcomeMsg,
      title: "Skill checker incomplete!",
      intro:
        "Complete each of the following request configurations and keep hitting Send to see the list update. "+
        "When you're done you'll get a 200 OK status code!",
      skills: [
        {
          name: "Changed method",
          hint: "Try anything other than GET",
          value: learner.methods>0 ? true : false
        },
        {
          name: "Sent query parameter",
          hint:
            "Add 'email' as a query param, with your student training email address (personal, not your school email) as the value.",
          value: learner.email.length>0 ? true : false
        },
        {
          name: "Added body data",
          hint:
            "Add JSON body data including a field `name` with the value as your name.",
          value: learner.bodies>0 ? true : false
        },
        {
          name: "Authorized",
          hint:
            "Add API Key auth with the name `auth_key` and the name of your school as the value.",
          value: learner.auth>0 ? true : false
        },
        {
          name: "Set a variable",
          hint:
            "Add a variable to the collection, naming it 'myCourse' and giving it the name of your course as the value.",
          value: learner.vars>0 ? true : false
        },
        {
          name: "Added a script",
          hint:
            "Add script code to the request Tests to set a variable named 'responseData', with a value from the `rand` field in the response JSON. "+
            "Hint: you'll need to run the request twice because the test code won't run until after the response is received.",
          value: learner.script>0 ? true : false
        }
      ],
      rand: ""+learner.rand
    });
  });

  //get request with query param
  app.get("/customer", function(req, res) {
    if (!req.query.id) {
      var newDate = new Date();
      db.get("calls")
        .push({
          when: newDate.toDateString() + " " + newDate.toTimeString(),
          where: "GET /customer",
          what: null
        })
        .write();
      res.status(404).json({
        welcome: welcomeMsg,
        tutorial: {
          title: "Your request is missing some info! 😕",
          intro: "This endpoint requires you to specify a customer.",
          steps: [
            {
              note:
                "In **Params** add `id` in the **Key** column, and one of the `id` values from the customer list as the **Value**."
            }
          ],
          next: [
            {
              step:
                "With your parameter in place (you'll see e.g. `?id=3` added to the request address), click **Send** again."
            }
          ]
        }
      });
    } else {
      var newDate = Date();
      db.get("calls")
        .push({
          when: newDate.toDateString() + " " + newDate.toTimeString(),
          where: "GET /customer",
          what: req.query.id
        })
        .write();
      var customerRecord = db
        .get("customers")
        .find({ id: parseInt(req.query.id) })
        .value();
      if (customerRecord) {
        var customer = {
          id: customerRecord.id,
          name: customerRecord.name,
          type: customerRecord.type
        };
        res.status(200).json({
          welcome: welcomeMsg,
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
          welcome: welcomeMsg,
          tutorial: {
            title: "Your request contains invalid info! 😕",
            intro: "This endpoint requires the `id` for a valid customer.",
            steps: [
              {
                note:
                  "In **Params** add `id` in the **Key** column, and the ID of any customer you see in the array when you " +
                  "send the `Get all customers` request)."
              }
            ],
            next: [
              {
                step:
                  "With your parameter in place (you'll see e.g. `?id=3` added to the request address), click **Send** again."
              }
            ]
          }
        });
      }
    }
  });

  //get all users
  app.get("/customers", function(req, res) {
    var newDate = new Date();
    db.get("calls")
      .push({
        when: newDate.toDateString() + " " + newDate.toTimeString(),
        where: "GET /customers",
        what: req.get("user-id")
      })
      .write();
    console.log(req.get("user-id"));
    var customers = db
      .get("customers")
      .filter(c => c.admin === "postman" || c.admin === req.get("user-id"))
      .value()
      .map(r => {
        return { id: r.id, name: r.name, type: r.type };
      });
    res.status(200).json({
      welcome: welcomeMsg,
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
    var newDate = new Date();
    db.get("calls")
      .push({
        when: newDate.toDateString() + " " + newDate.toTimeString(),
        where: "POST /customer",
        what: req.get("user-id") + " " + req.body.name
      })
      .write();
    const apiSecret = req.get("auth_key");
    if (!apiSecret)
      res.status(401).json({
        welcome: welcomeMsg,
        tutorial: {
          title: "Your request is unauthorized! 🚫",
          intro: "This endpoint requires authorization.",
          steps: [
            {
              note:
                "In **Authorization** select **API Key** from the drop-down, enter `auth_key` as the **Key** and any text you like as the **Value**. " +
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
        welcome: welcomeMsg,
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
                name: "Dorothy Zbornak",
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
      var countId = db.get("count") + 1;
      db.get("customers")
        .push({
          id: countId,
          name: req.body.name,
          type: req.body.type,
          admin: adminId
        })
        .write();
      db.update("count", n => n + 1).write();
      res.status(201).json({
        welcome: welcomeMsg,
        tutorial: {
          title: "You added a new customer! 🏅",
          intro: "Your new customer was added to the database.",
          steps: [
            {
              note:
                "Go back into the first request you opened `Get all customers` and **Send** it again before returning here—" +
                "you should see your new addition in the array! _Note that this will only work if you're using the API 101 Postman template._"
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
    var newDate = new Date();
    db.get("calls")
      .push({
        when: newDate.toDateString() + " " + newDate.toTimeString(),
        where: "POST /customer",
        what:
          req.get("user-id") + " " + req.body.name + " " + req.params.cust_id
      })
      .write();
    const apiSecret = req.get("auth_key");
    if (!apiSecret)
      res.status(401).json({
        welcome: welcomeMsg,
        tutorial: {
          title: "Your request is unauthorized! 🚫",
          intro: "This endpoint requires authorization.",
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
        welcome: welcomeMsg,
        tutorial: {
          title: "Your request is incomplete! ✋",
          intro:
            "This endpoint requires an ID representing the customer to update.",
          steps: [
            {
              note:
                "This request includes a path parameter with `/:customer_id` at the end of the request address—open **Params** and replace " +
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
        welcome: welcomeMsg,
        tutorial: {
          title: "Your request is incomplete! ✋",
          intro:
            "This endpoint requires body data representing the updated customer details.",
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

      var updateCust = db
        .get("customers")
        .find({ id: parseInt(req.params.cust_id) })
        .value();
      if (updateCust && adminId != "postman" && updateCust.admin == adminId) {
        db.get("customers")
          .find({ id: parseInt(req.params.cust_id) })
          .assign({ name: req.body.name, type: req.body.type, admin: adminId })
          .write();

        res.status(201).json({
          welcome: welcomeMsg,
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
      } else {
        res.status(400).json({
          welcome: welcomeMsg,
          tutorial: {
            title: "Your request is invalid! ⛔",
            intro:
              "You can only update customers you added using the `POST` method during the current session (and that haven't been deleted).",
            steps: [
              {
                note:
                  "This request includes a path parameter with `/:customer_id` at the end of the request address—open **Params** and replace " +
                  "`placeholder` with the `id` of a customer you added when you sent the `POST` request. Copy the `id` from the response in the " +
                  "`Get all customers` request. ***You can only update a customer you added.***"
              }
            ],
            next: [
              {
                step:
                  "With the ID parameter for a customer _you added_ during this session in place, click **Send** again."
              }
            ]
          }
        });
      }
    }
  });

  //delete user
  app.delete("/customer/:cust_id", function(req, res) {
    const apiSecret = req.get("auth_key");
    if (!apiSecret)
      res.status(401).json({
        welcome: welcomeMsg,
        tutorial: {
          title: "Your request is unauthorized! 🚫",
          intro: "This endpoint requires authorization.",
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
        welcome: welcomeMsg,
        tutorial: {
          title: "Your request is incomplete! ✋",
          intro:
            "This endpoint requires an ID representing the customer to remove.",
          steps: [
            {
              note:
                "This request includes a path parameter with `/:customer_id` at the end of the request address—open **Params** and replace " +
                "`placeholder` with the `id` of a customer you added when you sent the `POST` request. Copy the `id` from the response in the " +
                "`Get all customers` request. ***You can only remove a customer you added.***"
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
    else {
      var adminId = req.get("user-id") ? req.get("user-id") : "anonymous";
      //check the record matches the user id
      var cust = db
        .get("customers")
        .find({ id: parseInt(req.params.cust_id) })
        .value();
      if (cust && adminId != "postman" && cust.admin == adminId) {
        db.get("customers")
          .remove({ id: parseInt(req.params.cust_id) })
          .write();
        res.status(200).json({
          welcome: welcomeMsg,
          tutorial: {
            title: "You deleted a customer! 🏆",
            intro: "Your customer was removed from the database.",
            steps: [
              {
                note:
                  "Go back into the first request you opened `Get all customers` and **Send** it again before returning here—" +
                  "you should see that your deleted customer is no longer in the array!"
              }
            ],
            next: [
              {
                step:
                  "🚀 You completed the API 101 collection! Check out the **API Learner** template to continue learning—it walks you through " +
                  "remixing your own API!<br/><br/>" +
                  "[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/cf574a217e39178d2c20)"
              }
            ]
          }
        });
      } else {
        res.status(400).json({
          welcome: welcomeMsg,
          tutorial: {
            title: "Your request is invalid! ⛔",
            intro:
              "You can only remove customers you added using the `POST` method during the current session (and that haven't been deleted).",
            steps: [
              {
                note:
                  "This request includes a path parameter with `/:customer_id` at the end of the request address—open **Params** and replace " +
                  "`placeholder` with the `id` of a customer you added when you sent the `POST` request. Copy the `id` from the response in the " +
                  "`Get all customers` request. ***You can only remove a customer you added.***"
              }
            ],
            next: [
              {
                step:
                  "With the ID parameter for a customer _you added_ during this session in place, click **Send** again."
              }
            ]
          }
        });
      }
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
        id: 1,
        name: "Blanche Devereux",
        type: "Individual",
        admin: "postman"
      },
      {
        id: 2,
        name: "Rose Nylund",
        type: "Individual",
        admin: "postman"
      },
      {
        id: 3,
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
    db.set("count", customers.length).write();
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

  //get all entries
  app.get("/all", function(req, res) {
    var learners = db.get("learners").value();
    res.status(200).json({
        learners: learners
      });
  });
  //get all entries
  app.get("/calls", function(req, res) {
    var calls = db.get("calls").value();
    console.log(process.env.PROJECT_REMIX_CHAIN);
    res.status(200).json(calls);
  });
  //admin delete
  app.delete("/records", function(req, res) {
    db.get("customers")
      .remove({ id: parseInt(req.query.cust_id) })
      .write();
    res.status(200).json({ message: "deleted" });
  });
};

module.exports = routes;
