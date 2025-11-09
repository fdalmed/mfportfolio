const express = require('express');
const app = express();
const path = require('path');

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve components from src/components
app.use('/components', express.static(path.join(__dirname, 'src/components')));

// Serve JSON data from src/data
app.use('/data', express.static(path.join(__dirname, 'src/data')));

// Serve assets (images, etc.)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});