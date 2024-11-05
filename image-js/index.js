// JavaScript code using Node.js to get some info about the image.
// We load the library that was installed using 'npm install image-js'
const { Image } = require('image-js');

// Loading an image is asynchronous and will return a Promise.
Image.load('cat.jpg').then(function (image) {
  console.log('Width', image.width);
  console.log('Height', image.height);
  console.log('colorModel', image.colorModel);
  console.log('components', image.components);
  console.log('alpha', image.alpha);
  console.log('channels', image.channels);
  console.log('bitDepth', image.bitDepth);
});

// Convert an image to greyscale
Image.load('cat.jpg').then(function (image) {
  var grey = image.grey();
  grey.save('./output/cat-grey.jpg');
});

// Split an RGB image in its components
Image.load('cat.jpg').then(function (image) {
  var components = image.split();
  components[0].save('./output/cat-red.jpg');
  components[1].save('./output/cat-green.jpg');
  components[2].save('./output/cat-blur.jpg');
});
