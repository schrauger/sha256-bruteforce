const express = require('express');
const path = require('path');
const routes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes); // backend server api routes

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

//app.use(express.static('public'));

// GET route for homepage
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '/public/index.html'))
// });

// app.get('/verify', (req, res) => {
//     res.sendFile(path.join(__dirname, '/public/verify.html'))
// })

app.listen(PORT, () => 
    console.log('Server running')
);
