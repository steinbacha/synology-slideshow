const express = require('express');
const fs = require('fs');
const path = require('path');
const rp = require('request-promise-native');
const AdmZip = require('adm-zip');
require('dotenv').config();

const app = express();
const PORT = 3000;
const IMAGES_DIR = path.join(__dirname, 'images');
const TEMP_DIR = path.join(__dirname, 'temp');

const SYNOLOGY_API_URL = process.env.SYNOLOGY_API_URL;
const API_USER = process.env.API_USER;
const API_PASS = process.env.API_PASS;
const ALBUM_ID = process.env.ALBUM_ID;

// Function to authenticate and get the session ID
async function getSessionID() {
    try {
        const authResponse = await rp({
            uri: `${SYNOLOGY_API_URL}/auth.cgi`,
            qs: {
                api: 'SYNO.API.Auth',
                method: 'login',
                version: 6,
                account: API_USER,
                passwd: API_PASS,
                session: 'FileStation',
                format: 'sid'
            },
            json: true
        });

        if (authResponse && authResponse.success && authResponse.data && authResponse.data.sid) {
            return authResponse.data.sid;
        } else {
            throw new Error('Failed to retrieve session ID');
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        throw error;
    }
}

// Function to download and unzip the album
async function downloadAndUnzipAlbum(sessionID) {
    try {
        const albumDownloadUrl = `${SYNOLOGY_API_URL}/entry.cgi`;
        const zipPath = path.join(TEMP_DIR, `album_${ALBUM_ID}.zip`);

        const zipResponse = await rp({
            uri: albumDownloadUrl,
            qs: {
                api: 'SYNO.Foto.Browse.Album',
                method: 'download',
                version: 1,
                id: ALBUM_ID,
                _sid: sessionID
            },
            headers: {
                'Cookie': `id=${sessionID}`
            },
            encoding: null
        });

        fs.writeFileSync(zipPath, zipResponse);

        const zip = new AdmZip(zipPath);
        zip.extractAllTo(IMAGES_DIR, true);

        fs.unlinkSync(zipPath);
    } catch (error) {
        console.error('Error downloading and unzipping album:', error);
        throw error;
    }
}

// Route to trigger image download
app.get('/update', async (req, res) => {
    try {
    // Delete the existing image directory
    fs.rmSync(IMAGES_DIR, { recursive: true, force: true });

    // Create the image directory
    fs.mkdirSync(IMAGES_DIR, { recursive: true });

        const sessionID = await getSessionID();
        await downloadAndUnzipAlbum(sessionID);
        res.send('Album downloaded and images extracted successfully!');
    } catch (error) {
        console.error('Error downloading images:', error);
        res.status(500).send('Error downloading images');
    }
});

// Serve static files from the images directory
app.use('/images', express.static(IMAGES_DIR));

// Serve the slideshow
app.get('/', (req, res) => {
    fs.readdir(IMAGES_DIR, (err, files) => {
        if (err) {
            console.error('Error reading images directory:', err);
            res.status(500).send('Error reading images directory');
            return;
        }

        const imageFiles = files.map(file => `/images/${file}`);
        res.render('slideshow', { images: imageFiles });
    });
});

// Set view engine to ejs
app.set('view engine', 'ejs');

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});