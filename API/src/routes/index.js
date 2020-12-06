const express = require('express')
const router = express.Router();

router.get('/', (req, res) =>{
    res.sendFile('C:/Users/sergi/OneDrive/Escritorio/White Box 2/Tec2/Last Chance/Inteligencia Artificial/Proyecto/SnapAI/API/src');
});

module.exports = router;