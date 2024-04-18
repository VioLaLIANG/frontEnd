let url1,url2,url3;
const DROPPER_COUNT = 50;
const boldMode = false;
const debugText = false;
const fullSize = true;

// const charStr = '012345789Z:・."=*+-<>¦｜_/\\';

let symbols = [];

let chars = [];
let droppers = [];
let lifespan = [];
let colors = [];

let charWidth;
let charHeight;

let charSize = 16;
let NewArray = [];

async function loadDescriptionWords() {
  const url = './scrapedUrl.json'; 
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      shortDescription = data.shortDescription;
      symbols = shortDescription.match(/\b(\w+)\b/g);
      console.log('Symbols loaded:', symbols);
  } catch (error) {
      console.error('Failed to load words:', error);
  }
}

loadDescriptionWords();

// document.addEventListener('DOMContentLoaded', function() {
//     const form = document.querySelector('form');
//     form.addEventListener('submit', function(event) {
//         event.preventDefault(); // Prevents the form from submitting traditionally

//         // Fetch the input values (as before)
//         url1 = document.getElementById('input1').value;
//         url2 = document.getElementById('input2').value;
//         url3 = document.getElementById('input3').value;
//         console.log(url1, url2, url3);

//         const response = fetch('http://localhost:7400/api/link', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 link1: url1,
//                 link2: url2,
//                 link3: url3
//             })
//         })
//         .then((response) => console.log(response))
//         .catch((err) => console.log(err));

//         // Update the submission message
//         const messageElement = document.getElementById('submissionMessage');
//         messageElement.innerText = 'Submission successful!';

//         // Optional: Clear the form fields after submission
//         form.reset();
//     });
// });

function setup() {
  let canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.parent('p5-canvas');
  
  colorMode(HSL, 360, 255, 100);
  noStroke();
  textSize(charSize);
  textAlign(CENTER);
  textFont('monospace');
  
  if (boldMode)
  textStyle(BOLD);
  
  charWidth = round(width / charSize);
  charHeight = round(height / charSize + 1);
  
  for (let y = 0; y < charHeight; y++) {
    for (let x = 0; x < charWidth; x++) {
      let c = randomCode();
      //chars.push(c);
      chars.push(0);
      lifespan.push(0);
      colors.push(0);
    }
  }
  
  for (let i = 0; i < charWidth * 1.5; i++) {
    droppers.push(new Dropper(
      // round(random(charWidth)),
      // round(random(charHeight))
      30,20
    ));
  }
}

function draw() {
  background(0);
  translate(charSize / 2, 0);
  // for (let y = 0; y < charHeight; y++) {
  //    let yp = y * charSize;//计算每行字符的垂直位置，charSize 是每个字符的大小（包括高度和宽度）。
  //   for (let x = 0; x < charWidth; x++) {
  //     let i = x + y * charWidth;
  //     if (random() < 0.05)

  //       chars[i] = randomCode();
  //     let ls = lifespan[i];
  //     if (ls > 0) {
  //       lifespan[i] -= 2;
        
  //       if (lifespan[i] < 50)
  //         colors[i] = lifespan[i];
  //       fill(140, 255, colors[i]);
  //       text(chars[i], x * charSize, yp);
  //     }
  //   }
  // }

  // Assuming 'symbols' is an array of characters.
let symbolIndex = 0; // This will keep track of which symbol to use next.

for (let y = 0; y < charHeight; y++) {
    let yp = y * charSize;
    for (let x = 0; x < charWidth; x++) {
        let i = x + y * charWidth;
        
        // Use the current symbol and increment the index
        chars[i] = symbols[symbolIndex];
        symbolIndex = (symbolIndex + 1) % symbols.length; // Loop back to start if end is reached
        //console.log("chars[i]", chars[i]);
        //console.log("symbolIndex", symbolIndex);

        let ls = lifespan[i];
        if (ls > 10) {

            lifespan[i] -= 2;
            
            if (lifespan[i] < 50)
            colors[i] = lifespan[i];
            fill(140, 255, colors[i]);
            text(chars[i], x * charSize, yp);
        }
    }
  
}

  
  for (let i = 0; i < droppers.length; i++) {
    let d = droppers[i];
    let py = floor(d.y);
    // d.y += d.speed;
    d.y += d.speed * 0.05;
    if (d.y > charHeight) {
      d.y = 0;
      // d.x = floor(random(charWidth));
    }
    let ry = floor(d.y);
    if (ry - py >= 1) {
      let previ = d.x + py * charWidth;
      let newi = d.x + ry * charWidth;
      lifespan[previ] = 80;
      colors[previ] = 50;
      lifespan[newi] = 100;
      colors[newi] = 100;
    }
  }
  
  // if (debugText) {
  //   fill(255);
  //   text(frameRate(), 12, 12);
  // }
}

function Dropper(x, y) {
  this.x = x;
  this.y = y;
  this.speed = 0.5;
  this.lifespan = 100;

}

function randomCode() {
  // return String.fromCharCode(0x30A0 + round(random(96)));
  return symbols[floor(random(symbols.length))];
}
