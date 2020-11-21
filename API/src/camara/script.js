const video = document.getElementById('video')

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
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const  detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
      
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)

    if(detections.length > 0){
      //Take a snap
      console.log("Working as intended")
      const snapShot = canvas.getContext('2d').drawImage(video, 0, 0, video.width, video.height)
      console.log(canvas.toDataURL('image/jpeg'))
      var snapString = canvas.toDataURL('image/jpeg')
      myjson = '{' + '"fecha":' + '"' + today + '"' + ' , ' + '"image":' + '"' + snapString + '"' + '}';
      blob = new Blob([myjson], {type : "application/json"});
      saveAs(blob, "my_outfile.json"); 
    }
    //faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    //faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 10000)
  
})