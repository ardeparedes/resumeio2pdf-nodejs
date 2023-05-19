const fs = require('fs');
const https = require('https');
const PDFDocument = require('pdfkit');

const resumeMeta = 'https://ssr.resume.tools/meta';
const resumeExt = 'png'; // png, jpeg
const resumeIMG = 'https://ssr.resume.tools/to-image';
const resumeSize = 1125;

async function main() {
  const args = process.argv.slice(2);
  const url = args.find((arg) => /^https:\/\/resume.io\/r\/[a-zA-Z0-9]+$/.test(arg));

  if (!url) {
    console.error('Please provide a URL to a resume.');
    return;
  }

  const sid = extractSidFromUrl(url);

  console.log('SecureID:', sid);
  console.log('URL:', url);

  const meta = await getMeta(sid);
  const images = await getResumeImages(sid, meta.pages.length);

  await generatePDF(meta, images, sid);

  cleanup(images);

  console.log('Resume stored to', `${sid}.pdf`);
}

function extractSidFromUrl(url) {
  const segments = url.split('/');
  return segments[segments.length - 1];
}

function cleanup(images) {
  images.forEach(image => {
    if (fs.existsSync(image)) {
      fs.unlinkSync(image);
      console.log('Image', image, 'successfully deleted.');
    }
  });
}

async function generatePDF(info, images, sid) {
  console.log('Start Generate PDF');

  const doc = new PDFDocument({ autoFirstPage: false });
  doc.pipe(fs.createWriteStream(`${sid}.pdf`));

  for (let i = 0; i < images.length; i++) {
    console.log('Add page #', i + 1);

    const { width, height } = info.pages[i].viewport;

    doc.addPage({ size: [width, height] });

    const imageBuffer = fs.readFileSync(images[i]);
    const imageOptions = {
      fit: [width, height],
      align: 'center',
      valign: 'center',
    };
    const x = (doc.page.width - imageOptions.fit[0]) / 2;
    const y = (doc.page.height - imageOptions.fit[1]) / 2;

    doc.image(imageBuffer, x, y, imageOptions);

    const links = info.pages[i].links;
    if (Array.isArray(links)) {
      for (const link of links) {
        console.log('Add link to', link.url);
        const linkX = x + link.left;
        const linkY = y + height - link.top - link.height;

        doc.link(linkX, linkY, link.width, link.height, link.url);
      }
    }
  }

  doc.end();

  console.log('PDF stored to', `${sid}.pdf`);
}

async function getResumeImages(sid, p) {
  if (p < 1) {
    throw new Error('Required one or more pages');
  }

  const images = [];

  for (let pID = 1; pID <= p; pID++) {
    const pageFile = `${sid}-${pID}.${resumeExt}`;

    if (!fs.existsSync(pageFile)) {
      console.log('Download image #', pID, '/', p);
      const imgURL = `${resumeIMG}/ssid-${sid}-${pID}.${resumeExt}?cache=${Date.now()}&size=${resumeSize}`;
      await downloadPage(imgURL, pageFile);
    }

    images.push(pageFile);
  }

  console.log('Total', images.length, 'pages');

  return images;
}

function downloadPage(url, file) {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(file);

    https.get(url, response => {
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', error => {
      reject(error);
    });
  });
}

function getJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, response => {
      let data = '';

      response.on('data', chunk => {
        data += chunk;
      });

      response.on('end', () => {
        if (response.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error(`Failed to download information from resume.io. Error: ${response.statusCode}`));
        }
      });
    }).on('error', error => {
      reject(error);
    });
  });
}

async function getMeta(sid) {
  const metaURL = `${resumeMeta}/ssid-${sid}?cache=${Date.now()}`;
  const meta = await getJSON(metaURL);
  return meta;
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
