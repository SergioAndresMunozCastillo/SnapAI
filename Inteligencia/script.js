const imageUpload = document.getElementById('imageUpload')

var img = new Image();
var imageEncoded;
img.crossOrigin = 'Anonymous';
var myjson;
var today = new Date();
var dd = String(today.getDate() - 1).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
var hh = String(today.getUTCHours() + 17).padStart(2, '0');
if (hh >= 24){
	hh = 0 + (24 - hh)
}
var min = String(today.getMinutes()).padStart(2, '0');
var sec = String(today.getSeconds()).padStart(2, '0');
today = yyyy + '/' + mm + '/' + dd + ' at ' + hh + ':' + min + ':' + sec;
//var blob = new Blob([myjson], {type: "application/json"});
var blob;
var saveAs = window.saveAs;

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start)

async function start() {
  const container = document.createElement('div')
  container.style.position = 'relative'
  document.body.append(container)
  const labeledFaceDescriptors = await loadLabeledImages()
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
  let image
  let canvas
  document.body.append('Loaded')
  imageUpload.addEventListener('change', async () => {
    if (image) image.remove()
    if (canvas) canvas.remove()
    image = await faceapi.bufferToImage(imageUpload.files[0])
    container.append(image)
    canvas = faceapi.createCanvasFromMedia(image)
    container.append(canvas)
    const displaySize = { width: image.width, height: image.height }
    faceapi.matchDimensions(canvas, displaySize)
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box
      const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
      console.log(result.toString())
      drawBox.draw(canvas)
      img.onload = function() {
        var canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(this, 0,0);
        console.log("Imagen es -> " + canvas.toDataURL('image/jpeg'))
        imageEncoded = canvas.toDataURL('image/jpeg').toString()
        myjson = '{' + '"nombre":' + '"' + result.toString() + '"' + " , " + '"fecha":' + '"' + today + '"' + ' , ' + '"image":' + '"' + imageEncoded + '"' + '}';
        console.log("JSON es -> " + myjson)
        blob = new Blob([myjson], {type : "application/json"});
        saveAs(blob, "new_entry.json");
        }
        img.src = './image_to_read/image.jpg';

    })
  })
}

function loadLabeledImages() {
  const labels = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 'Tony Stark','Yo', 'Hector']
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(`/labeled_images/${label}/${i}.jpg`)
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
      }
      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}
/* C:/Users/alele/Desktop/Cosas/visual Code/IA/labeled_images/${label}/${i}.jpg 
https://raw.githubusercontent.com/WebDevSimplified/Face-Recognition-JavaScript/master/labeled_images/${label}/${i}.jpg*/