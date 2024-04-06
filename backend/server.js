const { error } = require("console");
const express = require("express");
const app = express();
const cors = require("cors");
const { user, exercises, exercisesCount, userActivity } = require("./db");

app.use(express.json());
app.use(cors());

app.post("/signup", async function(req, res) {
    const signupInfo = req.body;
    const email = signupInfo.email;
    const name = signupInfo.name;
    const gender = signupInfo.gender;
    const age = signupInfo.age;
    const height = signupInfo.height;
    const weight = signupInfo.weight;    
    const currentState = signupInfo.currentState;
    const password = signupInfo.password;
    console.log(weight);
    console.log(gender);
    console.log(currentState);

    await user.create({
        email: email,
        name: name,
        gender: gender,
        age: age,
        height: height,
        weight: weight,
        currentState: currentState,
        password: password
    })
    
    var exercisesObject = await exercises.find({Category: currentState});
    /*console.log(typeof exercisesObject);
    console.log(exercisesObject);
    console.log("abc");*/

    var exerciseList = [];
    exercisesObject.map((item) => {
        exerciseList.push(item.name);
    })
    
    /*if (weight < 60) {
        exerciseList = ["B1", "B2", "B3"];
    } else {
        exerciseList = ["I1", "I2", "I3"];
    }*/   

    res.json(
        exerciseList
    )
})


app.post("/level", async function(req, res) {
    const levelInfo = req.body;
    const targetLevel = levelInfo.targetLevel;
    const selectedExerciseList = levelInfo.selectedExerciseList;
    const email = levelInfo.email;
    console.log(targetLevel);
    console.log(selectedExerciseList);   

    await user.updateOne({
        email: email
    }, {
        goalState: targetLevel          
    })

    var selectedExercise = []
    selectedExerciseList.map((item) => {
        selectedExercise.push({ name: item, count: 0 });
    })

    const currentTime = new Date();
    const currentOffset = currentTime.getTimezoneOffset();
    const ISIOffset = 330; // UTC +5:30
    const ISTTime = new Date(currentTime.getTime() + ISIOffset*60000);
    console.log(ISTTime);

    await exercisesCount.create({
        email: email,
        selectedExercise: selectedExercise,
        isSleeping: false,    
        date: ISTTime
    })

    await userActivity.create({
        email: email
    })

    res.json(
        selectedExerciseList
    )
})

app.post("/todo", async function(req, res) {
    const todoInfo = req.body;
    const todoList = todoInfo.todoList;
    const selectedExerciseCount = todoInfo.exerciseCount;
    const email = todoInfo.email;
    console.log(selectedExerciseCount);

    var selectedExercise = []    
    var totalCalorie = 0;
    Object.entries(selectedExerciseCount).map(async (item) => {
        selectedExercise.push({ name: item[0], count: item[1].count });

        const calorie = await exercises.findOne({
            name: item[0]
        })
        totalCalorie += item[1].count * calorie.value;
    })
    
    await exercisesCount.updateOne({
        email: email        
    }, {
        selectedExercise: selectedExercise
    })

    const currentTime = new Date();
    const currentOffset = currentTime.getTimezoneOffset();
    const ISIOffset = 330; // UTC +5:30
    const ISTTime = new Date(currentTime.getTime() + ISIOffset*60000);
    console.log(ISTTime);

    const currentTime2 = new Date();    
    const ISIOffset2 = 330; // UTC +5:30
    currentTime2.setDate(currentTime2.getDate()+1);
    currentTime2.setHours(0, 0, 0);
    const tomorrow = new Date(currentTime2.getTime() + ISIOffset2*60000);
    console.log(tomorrow);
        
    /*const tomorrow = new Date(currentTime.getTime() + ISIOffset*60000);
    tomorrow.setDate(tomorrow.getDate()+1);
    tomorrow.setHours(0, 0, 0);
    console.log(tomorrow);*/

    const userActivityEntry = await userActivity.findOne({
        email: email
    })

    var historyArray = userActivityEntry.history;
    if(historyArray.length == 0) {
        historyArray.push({ date: ISTTime, calorieBurnt: totalCalorie, steps: 0, sleepDurationMinutes: 0 });
    }
    else {
        var lastElement = historyArray[historyArray.length-1];
        var lastDate = lastElement.date;

        if (lastDate >= ISTTime.setHours(0, 0, 0) && lastDate < tomorrow) {
            historyArray[historyArray.length-1].calorieBurnt = totalCalorie;
        }
        else {
            historyArray.push({ date: ISTTime, steps: 0, calorieBurnt: totalCalorie, sleepDurationMinutes: 0 });
        }
    }
    
    await userActivity.updateOne({
        email: email
    }, {
        history: historyArray
    })


    /*const query = { email: email,
                    "history.date": {"$gte": ISTTime.setHours(0, 0, 0), "$lt": tomorrow.setHours(0, 0, 0)} };
    const update = { $set: {} }
    await userActivity.updateOne({
        email: email,
        "history.date": {"$gte": ISTTime.setHours(0, 0, 0), "$lt": tomorrow.setHours(0, 0, 0)}
    }, {
        calorieBurnt: totalCalorie     
    })*/
    
    res.json(
        todoList
    )
})
app.post("/PostSteps", async function(req, res) {
    const stepInfo = req.body;
    const steps = stepInfo.steps;
    const email = stepInfo.email;
    const currentDate = new Date();
    
    const userActivityEntry = await userActivity.findOne({ email: email });
    if(userActivityEntry == null) {return res.status(404).json({ success: false });}
    const historyArray = userActivityEntry.history;
    const lastHistoryEntry = historyArray[historyArray.length - 1];
    
    if (lastHistoryEntry && lastHistoryEntry.date.toDateString() === currentDate.toDateString()) {
        lastHistoryEntry.steps = steps;
    } else {
        historyArray.push({ date: currentDate, steps: steps, calorieBurnt: 0, sleepDurationMinutes: 0 });
    }
    
    await userActivity.updateOne({ email: email }, { history: historyArray });
    console.log("Steps updated successfully")
    res.status(200).json({
        success: true
    });
})

app.post("/isSleep", async function(req, res) {
    const email = req.body.email;

    const exercisesCountEntry = await exercisesCount.findOne({
        email: email
    })
    console.log(exercisesCountEntry.isSleeping)

    res.json(
        exercisesCountEntry.isSleeping
    )
})

app.post("/sleep", async function(req, res) {
    const sleepFlag = req.body.sleepFlag;
    const email = req.body.email;

    const currentTime = new Date();
    const currentOffset = currentTime.getTimezoneOffset();
    const ISIOffset = 330; // UTC +5:30
    const ISTTime = new Date(currentTime.getTime() + ISIOffset*60000);
    console.log(ISTTime);

    const currentTime2 = new Date();    
    const ISIOffset2 = 330; // UTC +5:30
    currentTime2.setDate(currentTime2.getDate()-1);
    currentTime2.setHours(0, 0, 0);
    const yesterday = new Date(currentTime2.getTime() + ISIOffset2*60000);
    console.log(yesterday);

    if(sleepFlag) {
        await exercisesCount.updateOne({
            email: email
        }, {
            isSleeping: false            
        })

        const exercisesCountEntry = await exercisesCount.findOne({
            email: email
        })

        const sleepStartTime = exercisesCountEntry.sleepStartTime;
        console.log(sleepStartTime);

        const sleepDurationMinutes = (ISTTime - sleepStartTime) / 60000;

        const userActivityEntry = await userActivity.findOne({
            email: email
        })
    
        var historyArray = userActivityEntry.history;
        if(historyArray.length == 0 || historyArray.length == 1) {      
            historyArray.unshift({ date: yesterday, calorieBurnt: 0,  steps: 0,sleepDurationMinutes: sleepDurationMinutes }); // inserts at beginning of list
        }
        else {
            var lastElement = historyArray[historyArray.length-2];
            var lastDate = lastElement.date;
    
            if (lastDate >= yesterday && lastDate < ISTTime.setHours(0, 0, 0)) {
                historyArray[historyArray.length-2].sleepDurationMinutes = sleepDurationMinutes;
            }
            else {
                historyArray.splice(historyArray.length-1, 0,  { date: yesterday, calorieBurnt: 0, steps: 0,sleepDurationMinutes: sleepDurationMinutes }); // inserts before the last element
            }
        }
        
        await userActivity.updateOne({
            email: email
        }, {
            history: historyArray
        })
    }
    else {   
        await exercisesCount.updateOne({
            email: email
        }, {
            isSleeping: true,
            sleepStartTime: ISTTime
        })
    }

    res.json(
        email
    )
})

app.post("/history", async function(req, res) {
    const email = req.body.email;

    const userActivityEntry = await userActivity.findOne({
        email: email
    })
    
    res.json(
        userActivityEntry.history
    )
})

app.post("/login", async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    var validEmailPassword = []
    var todoList = []

    const userEntry = await user.find({
        email: email
    })

    if (userEntry.length == 0) {
        validEmailPassword.push(false);
        validEmailPassword.push(false);
    }
    else {
        if (password == userEntry[0].password) {
            validEmailPassword.push(true);
            validEmailPassword.push(true);

            const exercisesCountEntry = await exercisesCount.findOne({
                email: email
            })

            exercisesCountEntry.selectedExercise.map((item) => {
                todoList.push(item.name);
            })
        }
        else {
            validEmailPassword.push(true);
            validEmailPassword.push(false);
        }
    }

    res.json({
        validEmailPassword,
        todoList
    })
})

app.listen(3000, (error) => {
    if(!error){
        console.log("Server is running on port 3000.");
    }
    else{
        console.log("Server can't start");
    }
});