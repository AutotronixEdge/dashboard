// ------------------------------ DATABASE STUFF ------------------------------
fbUrl = "https://autotronix-test-database-default-rtdb.firebaseio.com/";

// Gets data from database
async function getData(url, item) {
    const response = await fetch(url + item + ".json");
    return response.json();
}

// Updates database
async function patchData(url, item, name, value) {
    data = { [name]: value };
    const response = await fetch(url + item + ".json", {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

// Deletes data from database
async function deleteData(url, item, name) {
    // data = { [name]: value };
    const response = await fetch(url + item + "/" + name + ".json", {
        method: "DELETE",
    });
}

// ------------------------------ DWEET STUFF ------------------------------
getUrl = "https://dweet.io/get/latest/dweet/for/AutotronixDataTransfer";
postUrl = "https://dweet.io/dweet/for/AutotronixDataTransfer?";

// Gets latest dweet content
async function getDweet(url = "") {
    const response = await fetch(url);
    return response.json();
}

// Posts data to dweet
async function postDweet(url = "", postData = "") {
    const response = await fetch(url + postData);
    return response.json();
}

dweetDataSet = {
    accelX: [],
    accelY: [],
    brake: [],
    gas: [],
    lat: [],
    lon: [],
    time: [],
    vel: [],
    wheel: [],
};

function extractDweet(dweet) {
    // Add dweet content to dataset if not a repeat
    if (!dweetDataSet.time.includes(Object.keys(dweet)[0])) {
        for (var prop in dweet) {
            let propData = dweet[prop].split(",");

            // store dataset values
            dweetDataSet.accelX.push(propData[0]);
            dweetDataSet.accelY.push(propData[1]);
            dweetDataSet.brake.push(propData[2]);
            dweetDataSet.gas.push(propData[3]);
            dweetDataSet.lat.push(propData[4]);
            dweetDataSet.lon.push(propData[5]);
            dweetDataSet.time.push(prop);
            dweetDataSet.wheel.push(propData[6]);

            // calc and store velocity
            let velocity = calcVel();
            dweetDataSet.vel.push(velocity.toFixed(2));
        }
        console.log("New Data Received");
    } else {
        console.log("Repeat Data Received");
    }
}

// Calculate the velocity from Lat and Lon points
function calcVel() {
    let velocity =
        getDistance(dweetDataSet) /
        (dweetDataSet.time[dweetDataSet.time.length - 2] -
            dweetDataSet.time[dweetDataSet.time.length - 1]);

    // Check if velocity is calculable (starting velocity value)
    if (!velocity) {
        velocity = 0;
    }
    return velocity;
}

// Calculates the distance from Lon and Lat data points in a dataset
function getDistance(coords) {
    var degToRad = Math.PI / 180;

    // console.log("length", coords.lat.length);
    let distance =
        6371000 *
        degToRad *
        Math.sqrt(
            Math.pow(
                Math.cos(coords.lat[coords.lat.length - 2] * degToRad) *
                    (coords.lon[coords.lon.length - 2] -
                        coords.lon[coords.lon.length - 1]),
                2
            ) +
                Math.pow(
                    coords.lat[coords.lat.length - 2] -
                        coords.lat[coords.lat.length - 1],
                    2
                )
        );
    return distance;
}

// Test Run
async function run() {
    // dweetDataSet = await getData(fbUrl, "Dataset");

    // Post dweet------------------------------------------
    // await postDweet(postUrl, "0=1,2,3,4,5,6,7&1=8,9,10,11,12,13,14");
    // await postDweet(postUrl, "stop=stop");

    // Delay for repeated posts (~1s)------------------------------
    // setTimeout(() => {
    //     postDweet(postUrl, "dweetName=dweetValue2");
    // }, 1000);

    // Get dweet---------------------------------
    dweetData = await getDweet(getUrl);
    dweetContent = dweetData.with[0].content;

    // Update dataset----------------------------------------------
    if (Object.keys(dweetContent)[0] != "stop") {
        extractDweet(dweetContent);
    }

    // Get first key method 1-------------------------------------
    // console.log("value:", Object.keys(dweetContent)[0]);

    // Get first key method 2------------------------------------------
    // for (var prop in dweetContent) {
    //     console.log("dataset:", prop, "\n", "data:", dweetContent[prop]);
    // }

    patchData(fbUrl, "", "Dataset", dweetDataSet);
}

// run();

// Setup a timer to periodically (in ms) update the dataset and graphs
myTimer = setInterval(timerFunction, 10000);

// Update dataset and graphs with timer if a session is in progress
function timerFunction() {
    if (inSession) {
        // postDweet(postUrl, "0=1,2,3,4,5,6,7&1=8,9,10,11,12,13,14&");
        postDweet(postUrl, randomDweet());
        run();
    }
}

// Generates random dweet data
function randomDweet() {
    max1 = 10;
    max2 = 10;
    max3 = 10;
    max4 = 10;
    max5 = 10;
    max6 = 10;
    max7 = 10;

    let dataString = "";
    let currentTime = new Date().getTime();

    for (let i = 0; i < 50; i++) {
        // ?time1=d1,d2,d3,d4,d5,d6,d7&time2=...
        // let delayres = delay(10);
        // currentTime += Math.floor(Math.random() * Math.floor(5));
        currentTime += 100;
        let tempString =
            currentTime +
            "=" +
            Math.floor(Math.random() * Math.floor(max1)) +
            "," +
            Math.floor(Math.random() * Math.floor(max2)) +
            "," +
            Math.floor(Math.random() * Math.floor(max3)) +
            "," +
            Math.floor(Math.random() * Math.floor(max4)) +
            "," +
            Math.floor(Math.random() * Math.floor(max5)) +
            "," +
            Math.floor(Math.random() * Math.floor(max6)) +
            "," +
            Math.floor(Math.random() * Math.floor(max7)) +
            "&";
        dataString += tempString;
    }

    return dataString;
}

function delay(delayInms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}
