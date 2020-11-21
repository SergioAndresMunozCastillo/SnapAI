const express = require('express');
const ngrok = require('ngrok');
const api = express();
const fs = require('fs');
const mongoose = require('mongoose')
const {mongourl} = require('./config/keys')
const Testy = require('./models/testy')
const SnapModel = require('./models/snap')
var imageJSON = JSON.parse(fs.readFileSync('C:/Users/sergi/Downloads/my_outfile.json', 'utf8'))

try{
    fs.unlinkSync('C:/Users/sergi/Downloads/my_outfile.json')
    console.log("File removed, check it out")
}catch(err){
    console.error(err)
}
mongoose.connect(mongourl);

api.listen(3000, () => {
    ngrok.connect(3000, function (err, url){
        if(err){
            console.log('Algo salio mal' + err);
            return;
        }
        console.log(`Server conectado a ${url}`)
    });
    console.log('API funcionando prro!')
});


api.get('/data', (req, res) => {
    console.log(imageJSON)
    res.json(imageJSON)

    res.send("GG")
});

api.get('/', (req, res) => {
    console.log(req);
    res.send("Sekiro...");
});

api.get('/save', (req, res) =>{
    const Item = new SnapModel(imageJSON)
    Item.save().then(data=>{
        console.log("Registrado compa")
    }).catch(err=>{
        throw err;
    })
})