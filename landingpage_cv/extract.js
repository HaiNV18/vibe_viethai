const fs = require('fs');
const path = require('path');

const buf = fs.readFileSync('Resume Nguyen Viet Hai.pdf');

// Find JPEGs
let pos = 0;
let imgCount = 0;
while ((pos = buf.indexOf(Buffer.from([0xff, 0xd8, 0xff]), pos)) !== -1) {
  let end = buf.indexOf(Buffer.from([0xff, 0xd9]), pos);
  if (end !== -1) {
    end += 2;
    const imgData = buf.subarray(pos, end);
    if (imgData.length > 2000) {
      const name = `extracted_img_${imgCount}.jpg`;
      fs.writeFileSync(name, imgData);
      console.log(`Saved ${name} (${imgData.length} bytes)`);
      imgCount++;
    }
    pos = end;
  } else {
    pos++;
  }
}

// Find PNGs
pos = 0;
let pngCount = 0;
while ((pos = buf.indexOf(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), pos)) !== -1) {
  let end = buf.indexOf(Buffer.from([0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82]), pos);
  if (end !== -1) {
    end += 8;
    const imgData = buf.subarray(pos, end);
    if (imgData.length > 1000) {
      const name = `extracted_png_${pngCount}.png`;
      fs.writeFileSync(name, imgData);
      console.log(`Saved ${name} (${imgData.length} bytes)`);
      pngCount++;
    }
    pos = end;
  } else {
    pos++;
  }
}
