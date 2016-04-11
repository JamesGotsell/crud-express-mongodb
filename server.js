const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require("mongodb").MongoClient;
const app = express();


app.use(bodyParser.urlencoded({extended: true}));

var db;

var username = process.env.MLAB_DATABASE_USER_NAME;
var password = process.env.MLAB_DATABASE_PASSWORD;
var path = process.env.MLAB_DATABASE_PATH;
var name = process.env.MLAB_DATABASE_NAME;

var url = "mongodb://" + username + password + path + name;

MongoClient.connect( url, (err, database) => {
    if (err) return console.log(err);
    db = database;
    app.listen(3000, () => {
        console.log('listening on 3000');
    });

});



app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")

});

app.post('/quotes', (req, res) => {
    db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

         console.log('saved to database')
        res.redirect('/')
    })
})