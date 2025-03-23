const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('./auth');
// Middleware
app.use(bodyParser.json()); 

// Database connection
const db = require('./db');

// Models

const MenuItem = require('./models/Menu');

// Routes
const personRoutes = require('./routes/personRoutes');
const menuRoutes = require('./routes/menuRoutes');

//middleware function

const logRequest = (req, res, next) => {
    console.log(`${new Date().toLocaleString()} Request made to : ${req.originalUrl}`);
    next();
}
app.use(logRequest)




app.use(passport.initialize());
const localAuthMiddleware = passport.authenticate('local',{session: false})



// Home route
app.get('/', (req, res) => {
    res.send('Hotel Management System By Atharva Dethe');
});

// API Routes
app.use('/person', personRoutes);
app.use('/menu', menuRoutes);




// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
