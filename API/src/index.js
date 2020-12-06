const path = require('path')
const express = require('express');
const ngrok = require('ngrok');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const api = express();
const morgan = require('morgan')
const fs = require('fs');
const indexRoutes = require('./routes/index')
const mongoose = require('mongoose')
const {mongourl} = require('./config/keys')
const Testy = require('./models/testy')
const SnapModel = require('./models/snap');
const { db } = require('./models/testy');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false});
var ObjectId = require('mongodb').ObjectId;
var o_id;
/*var imageJSON = JSON.parse(fs.readFileSync('C:/Users/sergi/Downloads/my_outfile.json', 'utf8'))
var imageString = imageJSON['image'].substring(23, imageJSON['image'].length)

try{
    fs.writeFile('C:/Users/sergi/OneDrive/Escritorio/White Box 2/Tec2/Last Chance/Inteligencia Artificial/Proyecto/SnapAI/Inteligencia/image_to_read/image.jpg', imageString, 'base64', function(err){
        if (err) throw err
        console.log('File saved.')
    })
    fs.unlinkSync('C:/Users/sergi/Downloads/my_outfile.json')
    console.log("File removed, check it out")
}catch(err){
    console.error(err)
}*/
mongoose.connect(mongourl);

api.listen(8080, () => {
    ngrok.connect(8080, function (err, url){
        if(err){
            console.log('Algo salio mal' + err);
            return;
        }
        console.log(`Server conectado a ${url}`)
    });
    console.log('API funcionando prro!')
});


api.set('views', path.join(__dirname, 'views'));

api.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
  }));
  
api.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Request-Method', 'POST');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    next();
  });
api.use(express.json());
api.use(morgan('dev'));
api.use(express.static(__dirname + '/views'));
api.get('/', (req, res) =>{
    //res.sendFile('C:/Users/sergi/OneDrive/Escritorio/White Box 2/Tec2/Last Chance/Inteligencia Artificial/Proyecto/SnapAI/API/src/views/login.html');
});

api.get('/data', (req, res) => {
    console.log(imageJSON)
    res.json(imageJSON)

    res.send("GG")
});

api.get('/nobody', (req, res) => {
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

api.post('/checkname', function(req, res){
    if(req.body.name.toLowerCase() === 'homer'){
        res.status(401).send({message: 'No admitido por homero'});
    } else {
        res.json('Bienvenidos al himalaya!');
    }
});

const updateModel = require('./models/updateModel');

var toSend;
updateModel.find({}, (err, oneModel) => {
    if(err){
        console.log(err);
    } else{
        console.log(oneModel);
        toSend = oneModel;
    }
});
api.get('/checkname', async function (req, res) {
    
    res.json(toSend);
});

(async () => {
    console.log("Async async")
})

api.post('/update', urlencodedParser,function(req, res){
    if(!req.body) return res.sendStatus(400)
    console.log(req.body)
    updateModel.findOneAndUpdate({id: req.body.id}, req.body, {upsert: true}, function(err, doc) {
        if(err) return res.send(500, {error: err});
        return res.send("Actualizado")
    })

    var imageString = req.body.image.substring(23, req.body.image.length)
    var dir = `C:/Users/sergi/OneDrive/Escritorio/White Box 2/Tec2/Last Chance/Inteligencia Artificial/Proyecto/SnapAI/Inteligencia/labeled_images/${req.body.nombre}`;
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    try{
        fs.writeFile(`C:/Users/sergi/OneDrive/Escritorio/White Box 2/Tec2/Last Chance/Inteligencia Artificial/Proyecto/SnapAI/Inteligencia/labeled_images/${req.body.nombre}/${req.body.id}.jpg`, imageString, 'base64', function(err){
            if (err) throw err
            console.log('File saved.')
        })
    }catch(err){
        console.error(err)
    }
});