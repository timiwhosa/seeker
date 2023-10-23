const path = require('path');
const cv = require('@u4/opencv4nodejs');
const express = require("express");
const app = express();

const Port = process.env.Port;

app.use(express.static("./Public"))
app.get("/",(req,res)=>{
  // Load a pre-trained model for object detection (e.g., Haar Cascade)
  const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

  // Read the input image
  const imageMat = cv.imread(path.join(__dirname,"/img/pexels-andrea-piacquadio-3960547.jpg"));

  // Detect objects in the image
  const { objects, numDetections } = classifier.detectMultiScale(imageMat);

  console.log(`Detected ${numDetections} objects.`);

  // Draw rectangles around detected objects
  const color = new cv.Vec(0, 255, 0); // Green color
  objects.forEach((rect) => {
    imageMat.drawRectangle(rect, color, 2);
  });

  // Save or display the image with detected objects
  cv.imwrite('./Public/output.jpg', imageMat);
  res.status(200).json({
    number: numDetections,
    img: './Public/output.jpg'
  })
});

app.listen(Port, ()=>{
  console.log("server started")
})
