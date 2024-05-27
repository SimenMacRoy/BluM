const express = require('express');
const app = express();

app.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;
    const deepLink = `blumapp://reset-password/${token}`;
    res.redirect(deepLink);
});

module.exports = app;
