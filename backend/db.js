const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/fitness_app")

const userSchema = mongoose.Schema({    
    email: String,
    name: String,
    gender: String,
    age: Number,
    height: Number,
    weight: Number,
    currentState: String,
    password: String,
    goalState: String    
})

const exerciseSchema = mongoose.Schema({
    name: String,
    value: Number,
   Category: String,
    Target: String,
        duration: Number,
        No: Number,
        Set: Number
    
})

const exerciseCountSchema = mongoose.Schema({
    email: String,
    selectedExercise: [{        
        name: String,
        count: Number        
    }],
    isSleeping: Boolean,
    sleepStartTime: Date,
    date: Date
})

const userActivitySchema = mongoose.Schema({
    email: String,
    history: [{
        date: Date,
        level:String,
        calorieBurnt: Number,
        footStep:Number,
        exerciseCompleted:Number,
        proteinRecommendation:Number,
        sleepDurationHours: Number,
        sleepDurationMinutes: Number
    }]    
})

const user = mongoose.model('user', userSchema);
const exercises = mongoose.model('exercises', exerciseSchema);
const exercisesCount = mongoose.model('exercises_count', exerciseCountSchema);
const userActivity = mongoose.model('user_activity', userActivitySchema);

module.exports = {    
    user,
    exercises,
    exercisesCount,
    userActivity
}