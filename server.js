const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require("mongodb").MongoClient;
const app = express();

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));

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
     db.collection('quotes').find().toArray((err, result) => {
        //console.log(result)
        if (err) return console.log(err)
        res.render("index.ejs" , {quotes: result})
    })
});

app.post('/quotes', (req, res) => {
    db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

         console.log('saved to database')
        res.redirect('/')
    })
})

app.put('/quotes', (req, res) => {
    db.collection('quotes')
    .findOneAndUpdate({name: 'Yoda'}, {
        $set: {
            name: req.body.name,
            quote: req.body.quote
        }
    }, {
        sort: {_id: -1},
        upsert: true
    }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
    })
})

app.delete('/quotes', (req, res) => {
    db.collection('quotes').findOneAndDelete({name: req.body.name}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('A darth vadar quote got deleted')
    })
})