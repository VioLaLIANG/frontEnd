const https = require('https');
const JSSoup = require('jssoup').default;
const fs = require('fs');


let url = '';
const jsonPath = "./json/";
const name = "scrapedUrl";

function getParagraphText (soupTag) {
  let paragraphs = soupTag.findAll('script');
  let text = '';
  for (let i = 0; i < paragraphs.length; i++) {
    text += paragraphs[i].getText();
  }

  let substringIndexStart = text.indexOf("shortDescription");
  let substringIndexEnd = text.indexOf("isCrawlable");
  let result = text.substring(substringIndexStart, substringIndexEnd);

  return result;
}

function ensureDirectoryExistence (filePath) {
  var dirname = require('path').dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function writeJSON (data) {
  try {
    ensureDirectoryExistence(jsonPath);
    let path = jsonPath + name + ".json";
    fs.writeFileSync(path, JSON.stringify(data, null, 2), "utf8");
    console.log("JSON file successfully saved");
  } catch (error) {
    console.error("An error has occurred: ", error);
  }
}

function createSoup (document) {
  let soup = new JSSoup(document);
  let main = soup.find('body');
  // console.log(main, 'main');
  if (!main) {
    console.error("Failed to find the main content in the document.");
    return;
  }
  let encodedText = getParagraphText(main);
  console.log("let's check the difference", encodedText);

  // Removing the special characters and format the encoded text 
  let processedText = encodedText.replace(/"/g, '').replace(/\\n/g, '').replace(/\\+/g, '').split(':');

  let value = processedText.slice(1).join(':');

  let data = {
    "name": name,
    "url": url,
    "shortDescription": value
  };

  writeJSON(data);
}

//Execute the second web scraping every 3 seconds
setInterval(() => {
  console.log("Executing data scraping...");
  fs.readFile('./json/scrapedID.json', 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      url = jsonData.url;
      https.get(url, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);
        let document = [];
        res.on('data', (chunk) => {
          document.push(chunk);
        }).on('end', () => {
          document = Buffer.concat(document).toString();
          createSoup(document);
        });

      }).on('error', (e) => {
        console.error('Error accessing the URL:', e);
      });
    } catch (error) {
      console.error("Error parsing JSON data:", error);
    }
  });

}, 3000); 