Webcam.set({
    width:350,
    height:350,
    image_format:'jpeg',
    jpeg_quality:90
})

Webcam.attach("#camera")

function capturar_rostro(){
    Webcam.snap(function(data_uri){
        document.getElementById('results').innerHTML = 
        '<img src= "' + data_uri +'"/>';
    });
}