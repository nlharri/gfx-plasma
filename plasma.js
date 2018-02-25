window.onload = function() {

  const numOfColorsAtIndex = 4;
  const numOfColors = 256*256;
  const maxOffset = 2*Math.PI;

  var canvas = document.getElementById("viewport");
  var context = canvas.getContext("2d");

  var offset = 0;
  var offsetIncrement = 0.05;

  var width = canvas.width;
  var height = canvas.height;
  var imagedata = context.createImageData(width, height);

  var paletteRed   = [];
  var paletteGreen = [];
  var paletteBlue  = [];

  // to calculate the pixel index
  function pixelIndex(x, y, colorComp) {
    var pixelIndex = (y * width + x) * numOfColorsAtIndex;
    var colorCompOffset = 0;
    switch (colorComp) {
      case 'r':
        break;
      case 'g':
        colorCompOffset = 1;
        break;
      case 'b':
        colorCompOffset = 2;
        break;
      case 'a':
        colorCompOffset = 3;
        break;
      default:
        break;
    }
    return pixelIndex + colorCompOffset;
  }

  /*
  Colors from
    #FFFFFF to
    #FFFF00 to
    #FF8000 to
    #FF0000 to
    #000000
  */
  function generatePalette() {
    var quarterNumOfColors = Math.floor(numOfColors/4);
    var halfNumOfColors = Math.floor(numOfColors/2);
    for (var i = 0; i<quarterNumOfColors; i++) {
      paletteRed[i]   = 255;
      paletteGreen[i] = 255;
      paletteBlue[i]  = Math.floor((quarterNumOfColors - i) / quarterNumOfColors * 256);
    }
    for (var i = quarterNumOfColors; i<halfNumOfColors; i++) {
      paletteRed[i]   = 255;
      paletteGreen[i] = Math.floor((halfNumOfColors - i) / quarterNumOfColors * 128) + 128;
      paletteBlue[i]  = 0;
    }
    for (var i = halfNumOfColors; i<halfNumOfColors + quarterNumOfColors; i++) {
      paletteRed[i]   = 255;
      paletteGreen[i] = Math.floor((halfNumOfColors + quarterNumOfColors - i) / quarterNumOfColors * 128);
      paletteBlue[i]  = 0;
    }
    for (var i = halfNumOfColors + quarterNumOfColors; i<numOfColors; i++) {
      paletteRed[i]   = Math.floor((numOfColors - i) / quarterNumOfColors * 256);
      paletteGreen[i] = 0;
      paletteBlue[i]  = 0;
    }
  }

  /*
  Colors from
    #000000 to
    #0000FF to
    #00FF00 to
    #00FFFF to
    #FF0000 to
    #FF00FF to
    #FFFF00 to
    #FFFFFF
    _______
    #000000 to
    #0000FF to
    #00FFFF to
    #FFFFFF to
    #FFFF00 to
    #FF0000 to
    #000000 to
    #FFFFFF
    _______
    #FF0000 to
    #FFFF00 to
    #00FF00 to
    #00FFFF to
    #0000FF to
    #FF00FF to
    #FF0000
  */
  function generatePalette2() {
    // 7 szín - 6 elem
    var partialNumOfColors = Math.floor(numOfColors/6);
    // #FF0000 to #FFFF00
    for (var i = 0; i<partialNumOfColors; i++) {
      paletteRed[i]   = 255;
      paletteGreen[i] = Math.floor(i / partialNumOfColors * 256);
      paletteBlue[i]  = 0;
    }
    // #FFFF00 to #00FF00
    for (var i = partialNumOfColors; i<2*partialNumOfColors; i++) {
      paletteRed[i]   = Math.floor((2*partialNumOfColors - i) / partialNumOfColors * 256);
      paletteGreen[i] = 255;
      paletteBlue[i]  = 0;
    }
    // #00FF00 to #00FFFF
    for (var i = 2*partialNumOfColors; i<3*partialNumOfColors; i++) {
      paletteRed[i]   = 0;
      paletteGreen[i] = 255;
      paletteBlue[i]  = Math.floor((i - 2*partialNumOfColors) / partialNumOfColors * 256);
    }
    // #00FFFF to #0000FF
    for (var i = 3*partialNumOfColors; i<4*partialNumOfColors; i++) {
      paletteRed[i]   = 0;
      paletteGreen[i] = Math.floor((4*partialNumOfColors - i) / partialNumOfColors * 256);
      paletteBlue[i]  = 255;
    }
    // #0000FF to #FF00FF
    for (var i = 4*partialNumOfColors; i<5*partialNumOfColors; i++) {
      paletteRed[i]   = Math.floor((i - 4*partialNumOfColors) / partialNumOfColors * 256);
      paletteGreen[i] = 0;
      paletteBlue[i]  = 255;
    }
    // #FF00FF to #FF0000
    for (var i = 5*partialNumOfColors; i<6*partialNumOfColors; i++) {
      paletteRed[i]   = 255;
      paletteGreen[i] = 0;
      paletteBlue[i]  = Math.floor((6*partialNumOfColors - i) / partialNumOfColors * 256);
    }
  }

  function getColor(index, colorComp) {
    switch (colorComp) {
      case 'r':
        return paletteRed[index];
        break;
      case 'g':
        return paletteGreen[index];
        break;
      case 'b':
        return paletteBlue[index];
        break;
      default:
        break;
    }
  }

  function createPlasma() {
    var par1modi = 2+offset/maxOffset*2;
    var par2modi = 128+offset/maxOffset*128;

    for (var y = 0; y<height-1; y++) {
      for (var x = 0; x<width-1; x++) {

        var sinParam1 = (x/width+y/height)*3;//*par1modi; // 4 -- 8
        var sinParam2 = Math.sqrt((x - width / 2) * (x - width / 2) + (y - height / 2) * (y - height / 2))/100;///par2modi; //64 -- 32
        var sinParam3 = Math.sqrt((x * x + y * y))/70; ///par2modi; // 64 -- 32

        var color1 = Math.floor(numOfColors/2+Math.sin(sinParam1*(2*Math.PI)+offset)*numOfColors/2);
        var color2 = Math.floor(numOfColors/2+Math.sin(sinParam2*(2*Math.PI)+offset)*numOfColors/2);
        var color3 = Math.floor(numOfColors/2+Math.sin(sinParam3*(2*Math.PI)+offset)*numOfColors/2);

        var color = Math.floor((color1 + color2 + color3) / 3);
        color = Math.floor(color + offset*100) % numOfColors;

        if (y%2==0 || x%2==0) {
          color = Math.floor(color * 0.8) % numOfColors;
        }

        imagedata.data[pixelIndex(x,y,'r')] = getColor(color, 'r');
        imagedata.data[pixelIndex(x,y,'g')] = getColor(color, 'g');
        imagedata.data[pixelIndex(x,y,'b')] = getColor(color, 'b');
        imagedata.data[pixelIndex(x,y,'a')] = ((y%2)==0) ? 256 : 256;
      }
    }

    offset+=offsetIncrement;
    if (offset>maxOffset) {
      offset=0;
    }
    //   offsetIncrement=(-offsetIncrement);
    //   offset = maxOffset;
    // } else if (offset<Math.abs(offsetIncrement)) {
    //   offsetIncrement=(-offsetIncrement);
    //   offset = 0;
    // }
  }

  // Main loop
  function main() {
      // Request animation frames
      window.requestAnimationFrame(main);

      // Create the image
      createPlasma();

      // Draw the image data to the canvas
      context.putImageData(imagedata, 0, 1);
  }

  generatePalette2();

  // Call the main loop
  main();

}
