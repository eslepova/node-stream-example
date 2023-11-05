const fs = require('fs');
const path = require('path');
const express = require('express');

const PORT = 3000;
const FILE_PATH = path.join(__dirname, '/assets/frag_bunny.mp4');

const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/video', async (req, res) => {
    const videoSize = fs.statSync(FILE_PATH).size;
    const range = req.headers.range;
    const chunkSize = 1000000;
    const startRange = Number(range.replace(/\D/g, ""));
    const endRange = Math.min(startRange + chunkSize, videoSize - 1);

    const headers = {
        "Content-Range": `bytes ${startRange}-${endRange}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": videoSize,
        "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);

    const readableStream = fs.createReadStream(FILE_PATH, {start: startRange, end: endRange});

    readableStream.pipe(res);
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
