const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const {exercises} = require('./db.js'); // Assuming your model is defined in exerciseModel.js

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/fitness_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
    
    // Read the CSV file and insert data into MongoDB
    fs.createReadStream('./exercises.csv')
        .pipe(csv())
        .on('data', async (row) => {
            // Create a new Exercise instance from the CSV row data
            const duration = parseInt(row.Duration);
            const repetitions = parseInt(row.No);
            const sets = parseInt(row.Set);
            
            if (isNaN(duration) || isNaN(repetitions) || isNaN(sets)) {
                console.error((row))
                return; 
            };
               // Skip this row
            
            
            await exercises.create ({
                category: row.Category,
                name: row.Exercise,
                value:10,
                target: row.Target,
                duration: parseInt(row.Duration),
                repetitions: parseInt(row.No),
                sets: parseInt(row.Set)
            });
            
            
        })
        .on('end', () => {
            console.log('CSV file processed');
            mongoose.disconnect(); // Disconnect from MongoDB once done
        });
});
