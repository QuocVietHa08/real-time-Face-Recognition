// const video = document.getElementById('video');

// const loadFaceAPI = async () => {
//   await faceapi.nets.tinyFaceDetector.loadFromUri('./module');
//   await faceapi.nets.faceLandmark68Net.loadFromUri('./module');
//   await faceapi.nets.faceRecognitionNet.loadFromUri('./module');
//   await faceapi.nets.faceExpressionNet.loadFromUri('./module');
// };

// function getCameraStream() {
//   if (navigator.mediaDevices.getUserMedia) {
//     navigator.mediaDevices.getUserMedia({ video: {} }).then((stream) => {
//       video.srcObject = stream;
//     });
//   }
// }

// video.addEventListener('play', () => {
//   const canvas = faceapi.createCanvasFromMedia(video);

//   document.body.append(canvas);

//   const displaySize = {
//     width: video.videoWidth,
//     height: video.videoHeight,
//   };
//   setInterval(async () => {
//     const detects = await faceapi.detectAllFaces(
//       video,
//       new faceapi.TinyFaceDetectorOptions()
//     );
//     console.log('detects', detects);

//     faceapi.draw.drawDetections(canvas, displaySize);
//   }, 300);
// });

// loadFaceAPI().then(getCameraStream);
const video = document.getElementById('video');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/module'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/module'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/module'),
  faceapi.nets.faceExpressionNet.loadFromUri('/module'),
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  }, 100);
});
