const path = require('path')
const express = require('express');
const ngrok = require('ngrok');
const cors = require('cors');
const bodyParser = require('body-parser');
const api = express();
const morgan = require('morgan')
const fs = require('fs');
const mongoose = require('mongoose')
const {mongourl} = require('./config/keys')
const SnapModel = require('./models/snap');
var urlencodedParser = bodyParser.urlencoded({ extended: false});


try{
    if(fs.existsSync('C:/Users/sergi/Downloads/my_outfile.json')){
        var imageJSON = JSON.parse(fs.readFileSync('C:/Users/sergi/Downloads/my_outfile.json', 'utf8'))
        var imageString = imageJSON['image'].substring(23, imageJSON['image'].length)
        fs.writeFile('C:/Users/sergi/OneDrive/Escritorio/White Box 2/Tec2/Last Chance/Inteligencia Artificial/Proyecto/SnapAI/Inteligencia/image_to_read/image.jpg', imageString, 'base64', function(err){
            if (err) throw err
            console.log('File saved.')

        })
        fs.unlinkSync('C:/Users/sergi/Downloads/my_outfile.json')
        console.log("File removed, check it out")
    }else{
        console.log("No existe el archivo")
    }

    if(fs.existsSync('C:/Users/sergi/Downloads/new_entry.json')){
        var new_entry = JSON.parse(fs.readFileSync('C:/Users/sergi/Downloads/new_entry.json', 'utf8'))
    }else{
        console.log("No existe el archivo new_entry")
    }
}catch(err){
    console.log("El archivo no existe")
    console.log(err)
}

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





const updateModel = require('./models/updateModel');
const userModel = require('./models/userModel');
var toSendUpdate;
var toSendUser;

api.get('/save', (req, res) =>{
    const Item = new SnapModel(new_entry)
    Item.save().then(data=>{
        console.log("Registrado")
    }).catch(err=>{
        throw err;
    })
})

userModel.find({}, (err, oneModel) => {
    if(err){
        console.log(err);
    } else{
        //console.log(oneModel);
        toSendUser = oneModel;
    }
});

updateModel.find({}, (err, oneModel) => {
    if(err){
        console.log(err);
    } else{
        //console.log(oneModel);
        toSendUpdate = oneModel;
    }
});
api.get('/checkname', async function (req, res) {
    
    res.json(toSendUpdate);
});

api.get('/checkusers', async function(req, res){
    res.json(toSendUser);
})
api.post('/createuser', urlencodedParser,async function(req, res){
    if(!req.body) return res.sendStatus(400)
    const Item = new userModel(req.body);
    Item.save().then(data=>{
        console.log("Registrado " + req.body);
    }).catch(err=>{
        throw err;
    })
});
/*
api.get('/creando', urlencodedParser,async function(req, res){
    ide = Date.now().toString();
    let sample  = {
        id : ide,
        nombre: "Daigo99",
        contr: "coco"
    }
    const Item = new userModel(sample);
    Item.save().then(data=>{
        console.log("Registrado " + req.body);
    }).catch(err=>{
        throw err;
    })
});
*/

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
        //Create the image to the folder
        fs.writeFile(`C:/Users/sergi/OneDrive/Escritorio/White Box 2/Tec2/Last Chance/Inteligencia Artificial/Proyecto/SnapAI/Inteligencia/labeled_images/${req.body.nombre}/${req.body.id}.jpg`, imageString, 'base64', function(err){
            if (err) throw err
            console.log('File saved.')
        })

        //Get the directory list
        const {readdirSync} = require('fs')
        const getDirectories = source =>
        readdirSync(source, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)

        const auxDirectory = getDirectories("C:/Users/sergi/OneDrive/Escritorio/White Box 2/Tec2/Last Chance/Inteligencia Artificial/Proyecto/SnapAI/Inteligencia/labeled_images");
        var copyDirectory = `[ "${auxDirectory[0]}" `;

        for(var i = 1 in auxDirectory){
            copyDirectory += `,  "${auxDirectory[i]}"`
        }
        copyDirectory += `]`

        for(var i = 0 in req.body){
            console.log(req.body.id)
        }
        //Guardar lista de nombres
        fs.writeFile(`C:/Users/sergi/OneDrive/Escritorio/White Box 2/Tec2/Last Chance/Inteligencia Artificial/Proyecto/SnapAI/Inteligencia/new_json_data/new_data.json`, copyDirectory, 'UTF-8', function(err){
            if (err) throw err
            console.log('New set of names saved.')
        })
    }catch(err){
        console.error(err)
    }
    //Guardar id al que pertenece
    fs.writeFile(`C:/Users/sergi/OneDrive/Escritorio/White Box 2/Tec2/Last Chance/Inteligencia Artificial/Proyecto/SnapAI/Inteligencia/new_json_data/id.json`, `${req.body.id}`, 'UTF-8', function(err){
        if (err) throw err
        console.log('Id saved')
    })

});
