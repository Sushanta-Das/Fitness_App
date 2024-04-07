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
    var exerciseDone=0;
    var exerciseNo=0;
    async function processExercise(item) {
        selectedExercise.push({ name: item[0], count: item[1].count });
    
        const eachExercise = await exercises.findOne({ name: item[0] });
        exerciseNo += 1;
        // console.log(item[0], item[1].count, eachExercise.No, eachExercise.Set)
        exerciseDone += (item[1].count / (eachExercise.No * eachExercise.Set)); // in percentage
        // console.log(exerciseDone);
        totalCalorie += item[1].count * eachExercise.value;
    }
    const promises = Object.entries(selectedExerciseCount).map(processExercise);
    await Promise.all(promises);
    exerciseDone=parseInt(exerciseDone/ exerciseNo *100);
    console.log("Done = ", exerciseDone, " %");
    await exercisesCount.updateOne({
        email: email        
    }, {
        selectedExercise: selectedExercise
    })

    const currentTime = new Date();
    const currentOffset = currentTime.getTimezoneOffset();
    const ISIOffset = 330; // UTC +5:30
    const ISTTime = new Date(currentTime.getTime() + ISIOffset*60000);
    const ISTTimeTemp = new Date(currentTime.getTime() + ISIOffset*60000);
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
        historyArray.push({ date: ISTTime, calorieBurnt: totalCalorie,exerciseCompleted:exerciseDone, sleepDurationMinutes: 0 });
    }
    else {
        var lastElement = historyArray[historyArray.length-1];
        var lastDate = lastElement.date;

        if (lastDate >= ISTTimeTemp.setHours(0, 0, 0) && lastDate < tomorrow) {
            historyArray[historyArray.length-1].calorieBurnt = totalCalorie;
            historyArray[historyArray.length-1].exerciseCompleted = exerciseDone;
        }
        else {
            historyArray.push({ date: ISTTime, calorieBurnt: totalCalorie,exerciseCompleted:exerciseDone, sleepDurationMinutes: 0 });
        }
    }
    console.log(ISTTime);
    
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
            historyArray.unshift({ date: yesterday, calorieBurnt: 0, sleepDurationMinutes: sleepDurationMinutes }); // inserts at beginning of list
        }
        else {
            var lastElement = historyArray[historyArray.length-2];
            var lastDate = lastElement.date;
    
            if (lastDate >= yesterday && lastDate < ISTTime.setHours(0, 0, 0)) {
                historyArray[historyArray.length-2].sleepDurationMinutes = sleepDurationMinutes;
            }
            else {
                historyArray.splice(historyArray.length-1, 0, { date: yesterday, calorieBurnt: 0,exerciseCompleted:0, sleepDurationMinutes: sleepDurationMinutes }); // inserts before the last element
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

function BMR(weight, height, age, gender) {
    //    #ref BMR https://www.medicalnewstoday.com/articles/319731#calculating-daily-calorie-burn
    // ref protein https://www.acsm.org/docs/default-source/files-for-resource-library/protein-intake-for-optimal-muscle-maintenance.pdf
    height *= 0.3048; // height in meters
    let xy = 9.65 * weight + 573 * height - 5.08 * age + 260;
    let xx = 7.38 * weight + 607 * height - 2.31 * age + 43;
    if (gender.toLowerCase() === 'male') return xy;
    else if (gender.toLowerCase() === 'female') return xx;
    else return (xx + xy) / 2;
}
function get_sleep(age) {
    if (age<=13) {
        return "9 - 11 hours"
    }
    else if (age<=17) {
        return "8 - 10 hours"
    }
    else if (age<=64) {
        return "7 - 9 hours"
    }
    else if (age>=65) {
        return "7 - 8 hours"
    }
}
function maintainance_cal(weight, height, age, gender, active, cal_walking) {
    //    #ref BMR https://www.medicalnewstoday.com/articles/319731#calculating-daily-calorie-burn
    let bmr = Math.round(BMR(weight, height, age, gender));
    // console.log("BMR 2 =", bmr);
    let cal = (bmr + cal_walking) * 1.2;
    if (1 <= active && active < 3) cal = bmr * 1.37;
    else if (3 <= active && active <= 5) cal = bmr * 1.55;
    else if (6 <= active && active <= 7) cal = bmr * 1.725;
    else if (active > 7) cal = bmr * 1.9;
    let protien_points = Math.min(cal / bmr, 2);
    // console.log(protien_points);
    let carbs_min = Math.min(bmr * 1.2 - 0.8 * weight * 4 - cal * 0.25, cal - protien_points * weight * 4 - cal * 0.3); // cal
    let carbs_max = Math.max(bmr * 1.2 - 0.8 * weight * 4 - cal * 0.25, cal - protien_points * weight * 4 - cal * 0.3); // cal
    let dic = {
        'BMR': `${Math.round(bmr)} cal`,
        'minimum_calories': `${Math.round(bmr * 1.2)} cal`,
        'recommended_calories': `${Math.round(cal)} cal`,
        'protein_required': `${Math.round(0.8 * weight)} - ${Math.round(protien_points * weight)} gram`,
        'fat_required': `${Math.round(cal * 0.25 / 9)} - ${Math.round(cal * 0.3 / 9)} gram`,
        'carbs_required': `${Math.round(carbs_min / 4)} - ${Math.round(carbs_max / 4)} gram`,
        'sleep_recommeded':get_sleep(age)
    };
    return dic;
}




app.get("/recommendation", async function(req, res) {
    const email = req.body.email;
    // user
    const profile= await user.findOne({
        email: email
    });
    var activityWeightage=1;
    switch ((profile.currentState).toLowerCase()) {
        case "beginner":
            activityWeightage=.8; 
            break;
        case "intermediate":
            activityWeightage=1.25;
            break;
        case "advanced":
            activityWeightage=1.5
            break;
        default:
            break;
    }
    // console.log(profile)

    // activity
    const userActivityEntry = await userActivity.findOne({
        email: email
    })
    var history=userActivityEntry.history
    if (history.length>7) {
        history=history.slice(-7)
    }
    const totalExerciseCompleted = Math.round((history.reduce((total, entry) => total + entry.exerciseCompleted, 0))/100);
    // console.log(totalExerciseCompleted)
    //adding foot step calories
    // https://caloriesburnedhq.com/steps-to-calories/
    var step_calories=10 // assume each person walks atleast 300 steps a day
    try{
        step_calories=6*((history.slice(-1))[0].footStep /100) *(profile.height/6)*(profile.weight/100);
        if (!step_calories) {
            step_calories=10
        }
    }
    catch (error){step_calories=10}
    
    // getting recommendation
    recommendation=maintainance_cal(profile.weight, profile.height, profile.age, profile.gender, totalExerciseCompleted*activityWeightage, step_calories);
    res.json(
        {"user":profile,
        "state":profile.currentState,
        "calories_in_walking":step_calories,
        "workdays":totalExerciseCompleted,
        "recommendation":recommendation}
    )
    // res.json(
    //     step_calories
    // )
}) 

app.listen(3000, (error) => {
    if(!error){
        console.log("Server is running on port 3000.");
    }
    else{
        console.log("Server can't start");
    }
});
