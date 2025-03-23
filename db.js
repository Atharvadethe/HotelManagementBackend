const mongoose = require('mongoose');

const monogURL = 'mongodb://localhost:27017/hotels';

mongoose.connect(monogURL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Connected to MongoDB...');
});

db.on('error',()=>{
    console.log('Failed to connect to MongoDB...');
})

db.on('disconnect',()=>{
    console.log('Disconnected from MongoDB...');
})

module.exports = db;