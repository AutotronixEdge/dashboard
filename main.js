// Run at startup
async function startup() {
    // Setup a timer to periodically (in ms) update the dataset and graphs
    myTimer = setInterval(timerFunction, 1000);

    // Start webpage assuming a session is not in progress
    inSession = false;

    // Sets up initial graphs
    updatePlotly();

    // Update dataset and graphs with timer if a session is in progress
    function timerFunction() {
        if (inSession) {
            updatePlotly();
        }
    }

    // TABLE STUFF-----------------------------------------------------------------T
    viewWidth = window.innerWidth;
    viewWidth = viewWidth * 0.55 - 60;
    colWidth = viewWidth / 6;

    // Define table columns
    var columnDefs = [
        { headerName: "#", field: "lapNumber", width: 60 },
        { headerName: "Lap Time", field: "lapTime", width: colWidth },
        { headerName: "S1", field: "ls1", width: colWidth },
        { headerName: "S2", field: "ls2", width: colWidth },
        { headerName: "S3", field: "ls3", width: colWidth },
        { headerName: "S4", field: "ls4", width: colWidth },
        { headerName: "S5", field: "ls5", width: colWidth },
    ];

    // Define table row data
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

    // Let the grid know which columns and what data to use
    var gridOptions = {
        defaultColDef: {
            resizable: true,
            sortable: true,
        },
        columnDefs: columnDefs,
        rowData: rowData,
    };
    // Setup the grid after the page has finished loading
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
}

// Calculates the distance from Lon and Lat data points in a dataset
function distance(coords) {
    var degToRad = Math.PI / 180;
    return (
        6371000 *
        degToRad *
        Math.sqrt(
            Math.pow(
                Math.cos(coords.testLat[coords.testLat.length - 2] * degToRad) *
                    (coords.testLon[coords.testLon.length - 2] -
                        coords.testLon[coords.testLon.length - 1]),
                2
            ) +
                Math.pow(
                    coords.testLat[coords.testLat.length - 2] -
                        coords.testLat[coords.testLat.length - 1],
                    2
                )
        )
    );
}

//-------------------------------- Fetch Request --------------------------------H
// Initialize data related variables
testData = {};
testDataSet = {
    testEncoder: [],
    testIR1: [],
    testIR2: [],
    testAccelX: [],
    testAccelY: [],
    testLat: [],
    testLon: [],
    testVel: [],
    testTime: [],
};
previousData = "";
startTime = Date.now();
currentTime = 0;

// Gets the most recent data points from TextMagic DB
async function storeData() {
    // Fetch data
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

    // Save data in variable
    testData = await fetchData().catch((error) => {
        console.log("error!");
        console.error(error);
    });

    // Split data by commas
    splitTestData = testData.resources[0].text.split(",");

    // Check if data is repeated
    if (
        (!splitTestData.some(isNaN) && previousData != splitTestData) ||
        previousData == ""
    ) {
        // Get current session time
        currentTimeMs = Date.now();
        currentTime = (currentTimeMs - startTime) / 1000;

        // Add new data to dataset object
        testDataSet.testEncoder.push(splitTestData[0]);
        testDataSet.testIR1.push(splitTestData[1]);
        testDataSet.testIR2.push(splitTestData[2]);
        testDataSet.testAccelX.push(splitTestData[3]);
        testDataSet.testAccelY.push(splitTestData[4]);
        testDataSet.testLat.push(splitTestData[5]);
        testDataSet.testLon.push(splitTestData[6]);

        // Calculate the velocity from Lat and Lon points
        calcVelocity =
            distance(testDataSet) /
            (currentTime -
                testDataSet.testTime[testDataSet.testTime.length - 1]);

        // Check if velocity is calculable (starting velocity value)
        if (!calcVelocity) {
            calcVelocity = 0;
        }

        // Continue adding new data to dataset object
        testDataSet.testVel.push(calcVelocity.toFixed(2));
        testDataSet.testTime.push(currentTime);

        // Display updated dataset in console
        console.log("Current dataset:");
        console.log(testDataSet);

        // Display latest data for debugging
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
            "<b>Velocity:</b>" +
            "<br />" +
            testDataSet.testVel +
            "<br />" +
            "<b>Time:</b>" +
            "<br />" +
            testDataSet.testTime;
    }

    previousData = splitTestData.toString();

    return testDataSet;
}
//-------------------------------- Fetch Request --------------------------------H

// Updates the dataset and related graphs
async function updatePlotly() {
    // Get data from TextMagic DB
    receivedData = await storeData();

    // Update graphs
    var velTrace = {
        x: receivedData.testTime,
        y: receivedData.testVel,
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
        text: "m/s",
        name: "Velocity",
    };

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

    // Define graph layout
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

    // Prepare data for plotting
    var velData = [velTrace];
    var accelYData = [accelYTrace];
    var accelXData = [accelXTrace];
    var gasData = [gasTrace];
    var brakeData = [brakeTrace];
    var steerData = [steerTrace];

    // Plot data on graphs
    Plotly.newPlot("velocityGraph", velData, layout, { responsive: true });
    Plotly.newPlot("accelYGraph", accelYData, layout, { responsive: true });
    Plotly.newPlot("accelXGraph", accelXData, layout, { responsive: true });
    Plotly.newPlot("gasGraph", gasData, layout, { responsive: true });
    Plotly.newPlot("brakeGraph", brakeData, layout, { responsive: true });
    Plotly.newPlot("steeringGraph", steerData, layout, { responsive: true });
}

// Starts or stops data collection and graph updates
function startStopGraph() {
    inSession = !inSession;
    console.log("Start / Stop");
    startTime = Date.now();
}

// Resets data and graphs
function resetGraph() {
    inSession = false;

    testDataSet = {
        testEncoder: [],
        testIR1: [],
        testIR2: [],
        testAccelX: [],
        testAccelY: [],
        testLat: [],
        testLon: [],
        testVel: [],
        testTime: [],
    };

    updatePlotly();
    console.log("Reset");
}
