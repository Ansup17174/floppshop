const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();


app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build', 'index.html')))

app.get("/*", (request, response) => {
    response.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Node runs on port ${port}`);
    console.log(__dirname);
});