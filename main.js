// Run at Startup
async function startup() {
    myTimer = setInterval(timerFunction, 1000);

    inSession = false;

    myData = getBaseline();
    updatePlotly(myData);

    function timerFunction() {
        if (inSession) {
            updatePlotly(myData);
        }
    }

    // TABLE STUFF-----------------------------------------------------------------T
    viewWidth = window.innerWidth;
    viewWidth = viewWidth * 0.55 - 60;
    colWidth = viewWidth / 6;

    var columnDefs = [
        { headerName: "#", field: "lapNumber", width: 60 },
        { headerName: "Lap Time", field: "lapTime", width: colWidth },
        { headerName: "S1", field: "ls1", width: colWidth },
        { headerName: "S2", field: "ls2", width: colWidth },
        { headerName: "S3", field: "ls3", width: colWidth },
        { headerName: "S4", field: "ls4", width: colWidth },
        { headerName: "S5", field: "ls5", width: colWidth },
    ];

    // specify the data
    var rowData = [
        { lapNumber: 1, lapTime: 410, ls1: "1:10" },
        { lapNumber: 2, lapTime: 330, ls1: "1:00" },
        { lapNumber: 3, lapTime: 345, ls1: "1:10" },
        { lapNumber: 4, lapTime: 345, ls1: "1:10" },
        { lapNumber: 5, lapTime: 350, ls1: "1:10" },
        { lapNumber: 6, lapTime: 340, ls1: "1:10" },
        { lapNumber: 7, lapTime: 340, ls1: "1:10" },
        { lapNumber: 8, lapTime: 340, ls1: "1:10" },
        { lapNumber: 9, lapTime: 340, ls1: "1:10" },
        { lapNumber: 10, lapTime: 340, ls1: "1:10" },
    ];

    // let the grid know which columns and what data to use
    var gridOptions = {
        defaultColDef: {
            resizable: true,
            sortable: true,
        },
        columnDefs: columnDefs,
        rowData: rowData,
    };
    // setup the grid after the page has finished loading
    document.addEventListener("DOMContentLoaded", function () {
        var gridDiv = document.querySelector("#myGrid");
        new agGrid.Grid(gridDiv, gridOptions);
    });

    // ----- Table Data -----
    var i;
    var rowDataSum = 0;
    for (i = 0; i < rowData.length; i++) {
        rowDataSum = rowDataSum + rowData[i].lapTime;
    }
    rowDataAvg = rowDataSum / rowData.length;
    document.getElementById("lapTimes").innerHTML =
        "Average Lap Time: " + rowDataAvg.toFixed(2) + " s";
    // ----- Table Data -----
    // TABLE STUFF-----------------------------------------------------------------T

    //------------------------------------ html request ------------------------------------H
    var userName = "dannyharris2";
    var passWord = "oi6ZeQBvC95NuD1XvR8GJKzxtFZP6n";

    function authenticateUser(user, password) {
        var token = user + ":" + password;
        var hash = btoa(token);

        return "Basic " + hash;
    }

    function CallWebAPI() {
        // New XMLHTTPRequest
        var request = new XMLHttpRequest();
        request.open(
            "GET",
            "https://dry-eyrie-70197.herokuapp.com/https://rest.textmagic.com/api/v2/replies",
            false
        );
        request.setRequestHeader(
            "Authorization",
            authenticateUser(userName, passWord)
        );
        request.send();
        let testVar = request.response;
        testVar = JSON.parse(testVar);
        document.getElementById("map").innerHTML = testVar.resources[0].text;
    }
    // CallWebAPI();
    //------------------------------------ html request ------------------------------------H
}

//-------------------------------- html request method 2 --------------------------------H
testData = {};

testDataSet = {
    testEncoder: [0],
    testIR1: [0],
    testIR2: [0],
    testAccelX: [0],
    testAccelY: [0],
    testLat: [0],
    testLon: [0],
    testVel: [0],
    testTime: [0],
};

previousData = "";
startTime = Date.now();
currentTime = 0;

async function storeData() {
    // Fetch Data
    async function fetchData() {
        const response = await fetch(
            "https://dry-eyrie-70197.herokuapp.com/https://rest.textmagic.com/api/v2/replies",
            {
                headers: {
                    Authorization:
                        "Basic " +
                        btoa("dannyharris2:oi6ZeQBvC95NuD1XvR8GJKzxtFZP6n"),
                },
            }
        );
        return response.json();
    }
    // Save Data in Variable
    testData = await fetchData().catch((error) => {
        console.log("error!");
        console.error(error);
    });

    splitTestData = testData.resources[0].text.split(",");

    if (
        (!splitTestData.some(isNaN) && previousData != splitTestData) ||
        previousData == ""
    ) {
        currentTime = Date.now();
        timeDiff = (currentTime - startTime) / 1000;

        testDataSet.testEncoder.push(splitTestData[0]);
        testDataSet.testIR1.push(splitTestData[1]);
        testDataSet.testIR2.push(splitTestData[2]);
        testDataSet.testAccelX.push(splitTestData[3]);
        testDataSet.testAccelY.push(splitTestData[4]);
        testDataSet.testLat.push(splitTestData[5]);
        testDataSet.testLon.push(splitTestData[6]);
        testDataSet.testTime.push(timeDiff);

        console.log("Current Data Set:");
        console.log(testDataSet);

        // Display Latest Data
        document.getElementById("map").innerHTML =
            "<b>Encoder:</b>" +
            "<br />" +
            testDataSet.testEncoder +
            "<br />" +
            "<b>IR 1:</b>" +
            "<br />" +
            testDataSet.testIR1 +
            "<br />" +
            "<b>IR 2:</b>" +
            "<br />" +
            testDataSet.testIR2 +
            "<br />" +
            "<b>Accel X:</b>" +
            "<br />" +
            testDataSet.testAccelX +
            "<br />" +
            "<b>Accel Y:</b>" +
            "<br />" +
            testDataSet.testAccelY +
            "<br />" +
            "<b>Latitude:</b>" +
            "<br />" +
            testDataSet.testLat +
            "<br />" +
            "<b>Longitude:</b>" +
            "<br />" +
            testDataSet.testLon +
            "<br />" +
            "<b>Time:</b>" +
            "<br />" +
            testDataSet.testTime;
    }

    previousData = splitTestData.toString();

    return testDataSet;
}
//-------------------------------- html request method 2 --------------------------------H

function getBaseline() {
    function getRandomArbitrary(min, max) {
        let data = [];
        let i;
        for (i = 0; i < 100; i++) {
            data.push(Math.random() * (max - min) + min);
        }
        return data;
    }

    let accelerationData = getRandomArbitrary(0, 200);
    xLabels = Array.from({ length: 100 }, (v, k) => k + 1);
    let velocityData = [
        1,
        2,
        6,
        8,
        11,
        15,
        18,
        19,
        20,
        25,
        28,
        30,
        32,
        34,
        35,
        36,
        40,
        44,
        45,
        49,
        51,
        58,
        59,
        63,
        64,
        65,
        67,
        68,
        72,
        73,
        81,
        86,
        87,
        88,
        89,
        90,
        93,
        95,
        96,
        105,
        106,
        108,
        109,
        110,
        111,
        112,
        113,
        114,
        115,
        117,
        118,
        120,
        121,
        123,
        124,
        125,
        127,
        128,
        129,
        130,
        134,
        138,
        139,
        140,
        141,
        142,
        145,
        146,
        147,
        151,
        154,
        156,
        158,
        161,
        162,
        164,
        165,
        168,
        170,
        171,
        172,
        173,
        174,
        175,
        176,
        177,
        178,
        179,
        180,
        181,
        184,
        187,
        188,
        189,
        193,
        194,
        195,
        197,
        199,
        200,
    ];

    let currentTime = [
        [new Date().getMinutes(), new Date().getSeconds()].join(":"),
    ];

    return {
        x: xLabels,
        y1: velocityData,
        y2: accelerationData,
        time: currentTime,
    };
}

async function updatePlotly(myData) {
    //
    receivedData = await storeData();
    //

    // Generated Data
    myData.x.push(myData.x[myData.x.length - 1] + 1);
    myData.y1.push(50 * Math.sin(myData.x[myData.x.length - 1]) + 100);
    myData.y2.push(100 * Math.cos(myData.x[myData.x.length - 1]) + 100);
    myData.time.push(
        [new Date().getMinutes(), new Date().getSeconds()].join(":")
    );

    // Update Velocity Test Graph
    var velTrace = {
        x: myData.x,
        y: myData.y1,
        mode: "lines+markers",
        marker: {
            color: "red",
            size: 6,
        },
        line: {
            color: "red",
            width: 2,
            shape: "spline",
        },
        text: "m/s*",
        name: "Test Velocity",
    };

    var accelTrace = {
        x: myData.x,
        y: myData.y2,
        mode: "lines+markers",
        marker: {
            color: "cyan",
            size: 6,
        },
        line: {
            color: "cyan",
            width: 2,
            shape: "spline",
        },
        text: "m/s^2*",
        name: "Test Acceleration",
    };

    // Update Graphs
    var accelYTrace = {
        x: receivedData.testTime,
        y: receivedData.testAccelY,
        mode: "lines+markers",
        marker: {
            color: "cyan",
            size: 6,
        },
        line: {
            color: "cyan",
            width: 2,
            shape: "spline",
        },
        text: "m/s^2",
        name: "Y-Axis Acceleration",
    };

    var accelXTrace = {
        x: receivedData.testTime,
        y: receivedData.testAccelX,
        mode: "lines+markers",
        marker: {
            color: "cyan",
            size: 6,
        },
        line: {
            color: "cyan",
            width: 2,
            shape: "spline",
        },
        text: "m/s^2",
        name: "X-Axis Acceleration",
    };

    var gasTrace = {
        x: receivedData.testTime,
        y: receivedData.testIR1,
        mode: "lines+markers",
        marker: {
            color: "cyan",
            size: 6,
        },
        line: {
            color: "cyan",
            width: 2,
            shape: "spline",
        },
        text: "cm",
        name: "Gas Pedal",
    };

    var brakeTrace = {
        x: receivedData.testTime,
        y: receivedData.testIR2,
        mode: "lines+markers",
        marker: {
            color: "cyan",
            size: 6,
        },
        line: {
            color: "cyan",
            width: 2,
            shape: "spline",
        },
        text: "cm",
        name: "Brake Pedal",
    };

    var steerTrace = {
        x: receivedData.testTime,
        y: receivedData.testEncoder,
        mode: "lines+markers",
        marker: {
            color: "cyan",
            size: 6,
        },
        line: {
            color: "cyan",
            width: 2,
            shape: "spline",
        },
        text: "degrees*",
        name: "Steering Wheel Rotation",
    };

    var layout = {
        // title: "Vehicle Data Graph",
        xaxis: {
            title: "",
            // range: [0, 200], //Constant Range
            showgrid: false,
            // showline: true,
            // zeroline: true,
            // mirror: "ticks",
            // gridcolor: "white",
            // gridwidth: 2,
            zerolinecolor: "white",
            // zerolinewidth: 14,
            // linecolor: "cyan",
            // linewidth: 6,
            tickfont: {
                color: "white",
            },
            titlefont: {
                color: "white",
            },
        },
        yaxis: {
            title: "",
            showgrid: false,
            zerolinecolor: "white",
            tickfont: {
                color: "white",
            },
            titlefont: {
                color: "white",
            },
        },
        plot_bgcolor: "transparent",
        paper_bgcolor: "transparent",
        margin: {
            l: 15,
            r: 0,
            b: 30,
            t: 0,
            pad: 0,
        },
        legend: {
            x: 0.05,
            y: 1,
            orientation: "h",
            bgcolor: "transparent",
            font: {
                color: "white",
            },
        },
        hoverlabel: {
            bgcolor: "#303030",
            font: {
                color: "white",
            },
        },
    };

    // Test Data
    var velData = [velTrace, accelTrace];

    // Real Data
    var accelYData = [accelYTrace];
    var accelXData = [accelXTrace];
    var gasData = [gasTrace];
    var brakeData = [brakeTrace];
    var steerData = [steerTrace];

    Plotly.newPlot("velocityGraph", velData, layout, { responsive: true });
    Plotly.newPlot("accelYGraph", accelYData, layout, { responsive: true });
    Plotly.newPlot("accelXGraph", accelXData, layout, { responsive: true });
    Plotly.newPlot("gasGraph", gasData, layout, { responsive: true });
    Plotly.newPlot("brakeGraph", brakeData, layout, { responsive: true });
    Plotly.newPlot("steeringGraph", steerData, layout, { responsive: true });
}

function startStopGraph() {
    inSession = !inSession;
    console.log("Start / Stop");
    startTime = Date.now();
}

function resetGraph() {
    myData = getBaseline();
    inSession = false;

    testDataSet = {
        testEncoder: [0],
        testIR1: [0],
        testIR2: [0],
        testAccelX: [0],
        testAccelY: [0],
        testLat: [0],
        testLon: [0],
        testVel: [0],
        testTime: [0],
    };

    updatePlotly(myData);
    console.log("Reset");
}
