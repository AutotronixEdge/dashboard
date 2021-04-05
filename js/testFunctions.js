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

    for (let i = 0; i < 71; i++) {
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

        currentTime += (2 * Math.PI) / 20 + Math.random() * 0.0001;
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
            (Math.cos(currentTime) * 80000 + 80000) +
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
function getDistance(lat1, lon1, lat2, lon2) {
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

// Sets up websocket connection and event listeners to collect data
function setupWebsocket(url) {
    // Create WebSocket connection.
    socket = new WebSocket(url);

    // Connection opened
    socket.addEventListener("open", function (event) {
        // socket.send("Hello Server!");
        console.log("Websocket Connected");
    });

    // Listen for messages
    socket.addEventListener("message", function (event) {
        if (inSession) {
            console.log("Data Recieved");
            message = event.data;

            if (message == '{"connection" :"ok"}') {
                console.log("Connection: OK");
            } else {
                try {
                    parseData(message);
                } catch (e) {
                    console.log("Can't Parse Data . . .");
                }
                // updateGraphs(dweetDataSet);
                console.log(
                    "Received:",
                    event.data,
                    "at",
                    new Date().getHours() +
                        ":" +
                        new Date().getMinutes() +
                        ":" +
                        new Date().getSeconds() +
                        ":" +
                        new Date().getMilliseconds()
                );
            }
        }
    });

    socket.addEventListener("close", (event) => {
        console.log("The connection has been closed successfully.");
    });
}

function parseData(data) {
    // let packet = data.split("&");
    // console.log(packet);
    // packet = packet.filter(function (el) {
    //     return el != null;
    // });
    // console.log(packet);
    // for (let i = 0; i < packet.length - 1; i++) {
    //     let dataArray = packet[i].split(",");
    //     // if (
    //     //     dataArray.filter(function (el) {
    //     //         return el != null;
    //     //     })
    //     // ) {
    //     //     break;
    //     // }
    //     dweetDataSet.time.push(dataArray[0] / 1000);
    //     dweetDataSet.wheel.push(dataArray[1]);
    //     dweetDataSet.gas.push(dataArray[2]);
    //     dweetDataSet.brake.push(dataArray[3]);
    //     dweetDataSet.accelX.push(dataArray[4]);
    //     dweetDataSet.accelY.push(dataArray[5]);
    //     dweetDataSet.accelZ.push(dataArray[6]);
    //     dweetDataSet.lat.push(dataArray[7]);
    //     dweetDataSet.lon.push(dataArray[8]);
    //     dweetDataSet.vel.push((dataArray[9] / 1000) * 2.237);
    // }

    let dataArray = data.split(",");
    // console.log(dataArray);
    // packet = packet.filter(function (el) {
    //     return el != null;
    // });

    dweetDataSet.time.push(dataArray[0] / 1000);
    dweetDataSet.wheel.push(dataArray[1]);
    dweetDataSet.gas.push(dataArray[2]);
    dweetDataSet.brake.push(dataArray[3]);
    dweetDataSet.accelX.push(dataArray[4]);
    dweetDataSet.accelY.push(dataArray[5]);
    dweetDataSet.accelZ.push(dataArray[6]);
    dweetDataSet.lat.push(dataArray[7]);
    dweetDataSet.lon.push(dataArray[8]);
    dweetDataSet.vel.push((dataArray[9] / 1000) * 2.237);
    dweetDataSet.bat.push(dataArray[10]);
}
