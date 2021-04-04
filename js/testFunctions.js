// Test Functions
// Generates random dweet data
function randomDweet() {
    wheel = 50;
    gas = 70;
    brake = 20;
    accelX = 5;
    accelY = 10;
    accelZ = 10;
    lat = 20;
    lon = 20;
    vel = 90000;

    let dataString = "";
    let currentTime = new Date().getTime();
    // let currentTime = 0;

    for (let i = 0; i < 51; i++) {
        // ?time1=d1,d2,d3,d4,d5,d6,d7&time2=...
        // currentTime += 100;
        // let tempString =
        //     currentTime +
        //     "=" +
        //     Math.floor(Math.random() * Math.floor(wheel)) +
        //     "," +
        //     Math.floor(Math.random() * Math.floor(gas)) +
        //     "," +
        //     Math.floor(Math.random() * Math.floor(brake)) +
        //     "," +
        //     Math.floor(Math.random() * Math.floor(accelX)) +
        //     "," +
        //     Math.floor(Math.random() * Math.floor(accelY)) +
        //     "," +
        //     Math.floor(Math.random() * Math.floor(accelZ)) +
        //     "," +
        //     Math.floor(Math.random() * Math.floor(lat)) +
        //     "," +
        //     Math.floor(Math.random() * Math.floor(lon)) +
        //     "," +
        //     Math.floor(Math.random() * Math.floor(vel)) +
        //     "&";

        currentTime += (2 * Math.PI) / 20;
        // TESTING
        let tempString =
            currentTime +
            "=" +
            Math.sin(currentTime * 10) +
            ",10,10,10,10,10," +
            Math.sin(currentTime) * 10 +
            "," +
            Math.cos(currentTime) * 10 +
            "," +
            Math.cos(currentTime) * 80000 +
            "&";

        dataString += tempString;
    }

    return dataString;
}

function runTestCode() {
    for (let i = 0; i < latLon.length; i++) {
        let tempLatLon = latLon[i].split(",");
        dweetDataSet.lat.push(tempLatLon[0]);
        dweetDataSet.lon.push(tempLatLon[1]);
    }
}

function dweetRandomData() {
    postDweet(postUrl, randomDweet());
}

// Calculates the distance from Lon and Lat data points in a dataset
function getDistance2(lat1, lon1, lat2, lon2) {
    coords = {
        lat: [lat1, lat2],
        lon: [lon1, lon2],
    };
    var degToRad = Math.PI / 180;

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

// distance = getDistance2();
// console.log(distance);

// Create WebSocket connection.
const socket = new WebSocket("ws://18.237.79.7:3000");

// Connection opened
socket.addEventListener("open", function (event) {
    // socket.send("Hello Server!");
    console.log("Websocket Connected");
});
thisdata = "";
// Listen for messages
socket.addEventListener("message", function (event) {
    thisdata = event.data;
    parsedData = thisdata;
    try {
        // parsedData = JSON.parse(thisdata);
    } catch (e) {
        console.log("Parse Error . . .");
    }
    try {
        parseData(parsedData);
    } catch (e) {
        console.log("Can't Parse Data . . .");
    }
    updateGraphs(dweetDataSet);
    // console.log(
    //     "Received:",
    //     event.data,
    //     "at",
    //     new Date().getHours() +
    //         ":" +
    //         new Date().getMinutes() +
    //         ":" +
    //         new Date().getSeconds() +
    //         ":" +
    //         new Date().getMilliseconds()
    // );
});

function parseData(data) {
    let dataArray = data.split(",");
    dweetDataSet.wheel.push(dataArray[1]);
    dweetDataSet.gas.push(dataArray[2]);
    dweetDataSet.brake.push(dataArray[3]);
    dweetDataSet.accelX.push(dataArray[4]);
    dweetDataSet.accelY.push(dataArray[5]);
    dweetDataSet.accelZ.push(dataArray[6]);
    dweetDataSet.lat.push(dataArray[7]);
    dweetDataSet.lon.push(dataArray[8]);
    dweetDataSet.vel.push((dataArray[9] / 1000) * 2.237);
    dweetDataSet.time.push(dataArray[0] / 1000);
}
