const postImage = document.querySelector('img');

function componentToHex(rgb) {
  var hex = rgb.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(palette) {
  return palette.map(rgbArray => `#${componentToHex(rgbArray[0])}${componentToHex(rgbArray[1])}${componentToHex(rgbArray[2])}`);
}

postImage.crossOrigin = 'Anonymous';

const colorThief = new ColorThief();

// check if image is already loaded
if (postImage.complete) {
  // returns array with 10 hex colors
  console.log(rgbToHex(colorThief.getPalette(postImage, 10)));
} else {
  // attach event listener for when image finishes loading
  postImage.addEventListener('load', function() {
    // returns array with 10 hex colors
    console.log(rgbToHex(colorThief.getPalette(postImage, 10)));
  });
}