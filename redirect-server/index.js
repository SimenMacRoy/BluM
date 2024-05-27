const express = require('express');
const app = express();

app.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;
    const deepLink = `blumapp://reset-password/${token}`;
    res.redirect(deepLink);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
