// Test Functions
// Generates random dweet data
function randomDweet() {
    max1 = 10;
    max2 = 10;
    max3 = 10;
    max4 = 10;
    max5 = 10;
    max6 = 30;
    max7 = 20;
    max8 = 20;

    let dataString = "";
    let currentTime = new Date().getTime();

    for (let i = 0; i < 50; i++) {
        // ?time1=d1,d2,d3,d4,d5,d6,d7&time2=...
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
            "," +
            Math.floor(Math.random() * Math.floor(max8)) +
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

function circle() {
    max1 = 10;
    max2 = 10;
    max3 = 10;
    max4 = 10;
    max5 = 10;
    max6 = 30;
    max7 = 20;

    let dataString = "";
    let currentTime = new Date().getTime();

    for (let i = 0; i < 50; i++) {
        // ?time1=d1,d2,d3,d4,d5,d6,d7&time2=...
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
