// Run at startup
async function startup() {
    // Setup a timer to periodically (in ms) update the dataset and graphs
    myTimer = setInterval(timerFunction, 3000);

    // Setup event listeners
    document.querySelector("#loginBtn").addEventListener("click", login);
    document
        .querySelector("#startStopBtn")
        .addEventListener("click", startStop);
    document.querySelector("#resetBtn").addEventListener("click", reset);
    document
        .querySelector("#downloadBtn")
        .addEventListener("click", downloadData);
    document
        .querySelector("#extrasBtn")
        .addEventListener("click", showExtrasPanel);
    document.querySelector("#helpBtn").addEventListener("click", showHelpPanel);

    // Window resize event listener
    window.addEventListener("resize", windowResize);

    // TESTING
    document
        .querySelector("#flushBtn")
        .addEventListener("click", flushDatabase);

    // Initial reset
    reset();

    // Set focus on login
    document.querySelector("#racer_id").focus();

    function timerFunction() {
        if (inSession == true) {
            refresh();
        }
    }
}

// Main loop to get and display data
async function refresh() {
    // Get dweet data
    dweetData = await getDweet(getUrl);
    dweetContent = dweetData.with[0].content;
    let isNewData = extractDweet(dweetContent);

    // Update if new data
    if (isNewData) {
        updateGraphs(dweetDataSet);
        if (lapData.isNewLap) {
            // updateTable(lapData);
        }
        updateTrack(dweetDataSet);
    }
}

// Login to the site
function login() {
    // Get form values
    let idForm = document.querySelector("#racer_id");
    let codeForm = document.querySelector("#access_code");

    // Check access code
    if (codeForm.value == accessCode) {
        if (idForm.value != "") {
            racerId = idForm.value;
        }
        let loginPanel = document.querySelector("#loginPanel");
        loginPanel.style.visibility = "hidden";

        M.Toast.dismissAll();
        M.toast({
            html: "Loggin in as " + racerId,
            classes: "green",
        });

        console.log("Logged in as", idForm.value);
    } else {
        codeForm.value = "";
        codeForm.focus();

        M.Toast.dismissAll();
        M.toast({ html: "Incorrect Access Code", classes: "red lighten-2" });

        console.log("Incorrect Access Code");
    }
}

// Starts or stops data collection / presentation
function startStop(e) {
    let stopBtn = e.target;
    if (inSession == false) {
        stopBtn.classList.remove("green");
        stopBtn.classList.add("orange");
        inSession = true;
        stopBtn.innerHTML = "stop";

        console.log("Start");
    } else {
        stopBtn.classList.remove("orange");
        stopBtn.classList.add("green");
        inSession = false;
        stopBtn.innerHTML = "start";

        console.log("Stop");
    }
}

// Reset data and graphs
function reset(e) {
    inSession = false;

    // Reset data
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

    // TESTING---------------------------------------------------
    runTestCode();
    dweetRandomData();

    // Reset graphs
    updateGraphs(dweetDataSet);

    // Reset table----------------------------------------------------------------------
    updateTable(dweetDataSet);

    // Reset track
    updateTrack(dweetDataSet);

    // Generate new session id
    sessionId = "session" + new Date().getTime();

    // Reset start/stop button
    let stopBtn = document.querySelector("#startStopBtn");
    stopBtn.classList.remove("orange");
    stopBtn.classList.add("green");
    stopBtn.innerHTML = "start";

    console.log("Reset");
}

// Download current session as CSV
function downloadData(e) {
    let dlBtn = e.target;
    let dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(dweetDataSet));
    dlBtn.setAttribute("href", dataStr);
    dlBtn.setAttribute("download", sessionId + ".json");

    console.log("Downloaded Data");
}

// Shows the extras panel
function showExtrasPanel() {
    let extrasPanel = document.querySelector("#extrasPanel");
    if (extrasPanel.style.visibility == "visible") {
        extrasPanel.style.visibility = "hidden";
    } else {
        extrasPanel.style.visibility = "visible";
        document.querySelector("#helpPanel").style.visibility = "hidden";
    }
    console.log("Extras Panel");
}

// Shows the help panel
function showHelpPanel() {
    let helpPanel = document.querySelector("#helpPanel");
    if (helpPanel.style.visibility == "visible") {
        helpPanel.style.visibility = "hidden";
    } else {
        helpPanel.style.visibility = "visible";
        document.querySelector("#extrasPanel").style.visibility = "hidden";
    }
    console.log("Extras Panel");
}

// Deletes all data from database
function flushDatabase() {
    deleteData(fbUrl, "");

    console.log("Flushed Database");
}

// Updates graphs
function updateGraphs(data) {
    var velTrace = {
        x: data.time,
        y: data.vel,
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
        x: data.time,
        y: data.accelY,
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
        x: data.time,
        y: data.accelX,
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
        x: data.time,
        y: data.gas,
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
        x: data.time,
        y: data.brake,
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
        x: data.time,
        y: data.wheel,
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
            zerolinecolor: "white",
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

    // TESTING - Extras panel
    Plotly.newPlot("testGraph", steerData, layout, { responsive: true });
}

// Updates the track
function updateTrack(data) {
    $(".track").remove();

    exLat = [...data.lat]; //x
    exLon = [...data.lon]; //y

    exLatMin = Math.min(...exLat);
    exLonMin = Math.min(...exLon);

    exLat = exLat.map((x) => (x = x - exLatMin));
    exLon = exLon.map((x) => (x = x - exLonMin));

    exLatMax = Math.max(...exLat);
    exLonMax = Math.max(...exLon);

    exLat = exLat.map((x) => (x = (x / exLatMax) * 90 + 5));
    exLon = exLon.map((x) => (x = (x / exLonMax) * 80 + 5));

    color = "";
    for (let i = 0; i < exLat.length; i++) {
        var newPoint = document.createElement("div");
        newPoint.className = "track";

        // Set velocity color
        if (data.vel[i] < 20 || !data.vel[i]) {
            color = "#f54242";
        } else if (data.vel[i] < 20) {
            color = "#ffb300";
        } else if (data.vel[i] < 40) {
            color = "#fff700";
        } else if (data.vel[i] < 60) {
            color = "#bbff00";
        } else if (data.vel[i] < 80) {
            color = "#99ff00";
        } else if (data.vel[i] < 100) {
            color = "#f54242";
        } else {
            color = "#27ff00";
        }

        newPoint.style.backgroundColor = color;
        newPoint.style.left = exLat[i] + "%";
        newPoint.style.bottom = exLon[i] + "%";
        document.querySelector("#mapArea").append(newPoint);
    }

    // TESTING first/current track point
    if (inSession) {
        let testElement = document.querySelector("#mapArea").firstElementChild;
        testElement.style.backgroundColor = "magenta";
        testElement.style.width = "1em";
        testElement.style.height = "1em";
        let testElement2 = document.querySelector("#mapArea").lastElementChild;
        testElement2.style.backgroundColor = "cyan";
        testElement2.style.width = "1em";
        testElement2.style.height = "1em";
    }
}

// Updates the lap time table and calculations
function updateTable(data) {
    // Clears table to be remade
    document.getElementById("myGrid").innerHTML = "";

    viewWidth = window.innerWidth;
    viewWidth = viewWidth * 0.55 - 60;
    colWidth = viewWidth / 6;

    // Define table columns
    columnDefs = [
        { headerName: "#", field: "lapNumber", width: 60 },
        { headerName: "Lap Time", field: "lapTime", width: colWidth },
        { headerName: "S1", field: "ls1", width: colWidth },
        { headerName: "S2", field: "ls2", width: colWidth },
        { headerName: "S3", field: "ls3", width: colWidth },
        { headerName: "S4", field: "ls4", width: colWidth },
        { headerName: "S5", field: "ls5", width: colWidth },
    ];

    // Define table row data
    rowData = [];

    var i;
    for (i = 0; i < data.time.length; i++) {
        rowData[i] = {
            lapNumber: i + 1,
            lapTime:
                rowData.length == 0
                    ? data.time[i]
                    : (data.time[i] - data.time[i - 1]).toFixed(3),
            ls1: "--:--",
            ls2: "--:--",
            ls3: "--:--",
            ls4: "--:--",
            ls5: "--:--",
            ls6: "--:--",
        };
    }

    // Let the grid know which columns and what data to use
    gridOptions = {
        defaultColDef: {
            resizable: true,
            sortable: true,
        },
        columnDefs: columnDefs,
        rowData: rowData,
    };

    // Setup the grid
    gridDiv = document.querySelector("#myGrid");
    new agGrid.Grid(gridDiv, gridOptions);

    // Lap calculations
    var i;
    rowDataSum = 0;
    rowDataSet = [];
    for (i = 0; i < rowData.length; i++) {
        rowDataSum = rowDataSum + parseInt(rowData[i].lapTime);
        rowDataSet.push(rowData[i].lapTime);
    }
    rowDataAvg = rowDataSum / rowData.length;
    rowDataMin = Math.min(...rowDataSet);
    rowDataMax = Math.max(...rowDataSet);

    document.getElementById("lapTimes").innerHTML =
        "Average Lap Time: " +
        rowDataAvg.toFixed(2) +
        " s" +
        "<br />" +
        "Minimum Lap Time: " +
        rowDataMin.toFixed(2) +
        " s" +
        "<br />" +
        "Maximum Lap Time: " +
        rowDataMax.toFixed(2) +
        " s";
}

// Checks if a new lap has started and updates lap data
function newLap(newData) {
    let newLat = newData[5];
    let newLon = newData[6];

    let isNewLap = false;

    for (let i = 0; i < dweetDataSet.lat.length; i++) {
        if (dweetDataSet.lat[i] == newLat && dweetDataSet.lon[i] == newLon) {
            isNewLap = true;
            lapData.time.push(dweetDataSet.time[dweetDataSet.time.length - 1]);
            updateTable(lapData);

            console.log("New Lap at", i, "of", newLat, "and", newLon);
        }
    }

    // TESTING
    // Update lap data in database
    // patchData(fbUrl, "", "Dataset/" + sessionId, dweetDataSet);

    return isNewLap;
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

// Gets data from latest dweet and updates current dataset
function extractDweet(dweet) {
    // Add dweet content to dataset if not a repeat
    if (!dweetDataSet.time.includes(Object.keys(dweet)[0] / 1000)) {
        for (var prop in dweet) {
            let propData = dweet[prop].split(",");

            // Check if new lap
            newLap(propData);

            // store dataset values
            dweetDataSet.wheel.push(propData[0]);
            dweetDataSet.gas.push(propData[1]);
            dweetDataSet.brake.push(propData[2]);
            dweetDataSet.accelX.push(propData[3]);
            dweetDataSet.accelY.push(propData[4]);
            dweetDataSet.lat.push(propData[5]);
            dweetDataSet.lon.push(propData[6]);
            dweetDataSet.time.push(prop / 1000);

            // calc and store velocity
            let velocity = calcVel();
            dweetDataSet.vel.push(velocity.toFixed(2));
        }

        patchData(fbUrl, "", racerId + "/Dataset/" + sessionId, dweetDataSet);

        console.log("New Data Received");
        return true;
    } else {
        console.log("Repeat Data Received");
        return false;
    }
}

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

// Calculates the distance from Lon and Lat data points in a dataset
function getDistance(coords) {
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
async function deleteData(url, item = "", name = "") {
    // data = { [name]: value };
    const response = await fetch(url + item + "/" + name + ".json", {
        method: "DELETE",
    });
}

// Run on window resize
function windowResize() {
    updateTable(lapData);
}
