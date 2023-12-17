const express = require("express");
const fs = require("fs");
const path = require('path');
const app = express();
const port = process.env.PORT;

app.use( function ( req, res, next ) {
    const { url, path: routePath } = req ;
    console.log( 'Request: Timestamp:', new Date().toLocaleString(), ', URL (' + url + '), PATH (' + routePath + ').' ) ;
    next();
});

app.use('/public/', express.static(path.join(__dirname, '')))
app.listen(port, () => {
    console.log(`Server running on port ${port}...`)
});

app.post('/api/v1/change', function(req, res){
    fs.readFile(__dirname + "/data/" + "users.json", 'utf8', function(err, data){
        data = JSON.parse(data);
        console.log(data["user"+req.query["changeID"]], req.query["changeKey"]);
        data["user"+req.query["changeID"]][req.query["changeKey"]] = req.query["changeValue"];
        fs.writeFile(__dirname + "/data/users.json", JSON.stringify(data), err => {
            if (err) {
                console.error(err);
                return;
            }
        });
        console.log(data["user"+req.query["changeID"]]);
        res.json(data["user"+req.query["changeID"]]);
    });
});

app.get('/api/v1/listUsers', function(req, res) {
    fs.readFile(__dirname + "/data/" + "users.json", 'utf8', function(err, data){
        console.log (data, Object.keys(JSON.parse(data)));

        var transformedObject = {};
        for (const key in JSON.parse(data)) {
            if (JSON.parse(data).hasOwnProperty(key)) {
                transformedObject[key] = {
                    "name": JSON.parse(data)[key]["name"]
                };
            }
        }
        res.end(JSON.stringify(transformedObject));
    });
});


app.post('/api/v1/listUsers', function(req, res) {
    data = JSON.parse(data);
    console.log(data);
    fs.appendFile(__dirname + "/data/" + "users.json", 'utf8', function(err, data){
        console.log (data);
        res.end(data);
    });
});


app.post('/api/v1/addUser', function(req, res) {
    // Read existing users data
    fs.readFile(__dirname + "/data/" + "users.json", 'utf8', function(err, data){
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log(req.query["password"]);
        const newUser = {
            name: req.query["name"],
            password: req.query["password"],
            isAdmin: false,
            id: parseInt(req.query["user"])
        };

        const allUsers = JSON.parse(data); // Parse existing data

        console.log(newUser);

        // Add the new user to the array
        allUsers["user"+req.query["user"]] = newUser;

        // Write the updated object back to the file
        fs.writeFile(__dirname + "/data/" + "users.json", JSON.stringify(allUsers, null, 2), 'utf8', function(err) {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                console.log('User added successfully');
                res.json(allUsers[parseInt(req.query["user"])]); // Send the newly added user as the response
            }
        });
    });
});

app.get('/api/v1/login', function(req, res) {
    // Read existing users data
    fs.readFile(__dirname + "/data/" + "users.json", 'utf8', function(err, data){
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log(req.query["password"]);

        const allUsers = JSON.parse(data); // Parse existing data

        for (const [key, value] of Object.entries(allUsers)) {
            console.log(value["name"], req.query["name"], value["password"], req.query["password"]);
            if (value["name"] == req.query["name"] && value["password"] == req.query["password"]) {
                console.log(value);
                res.json(value);
            }
          }
    });
});

app.get('/api/v1/getFlag', function(req, res) {
    // Read existing users data
    fs.readFile(__dirname + "/data/" + "users.json", 'utf8', function(err, data){
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log(req.query["password"]);

        const allUsers = JSON.parse(data); // Parse existing data

        for (const [key, value] of Object.entries(allUsers)) {
            console.log(value["name"], req.query["name"], value["password"], req.query["password"]);
            if (value["name"] == req.query["name"] && value["password"] == req.query["password"]) {
                console.log(value);
                if (value["isAdmin"] === "true") {
                    fs.readFile(__dirname + "/data/" + "flag.txt", 'utf8', function(err, flag){
                        if (err) {
                            console.error(err);
                            res.status(500).send('Internal Server Error');
                            return;
                        }
                        res.end(flag);
                    });
                } else {
                    res.end("not allowed!");
                }
                
            }
          }
    });
});

