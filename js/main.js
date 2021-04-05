// Run at startup
async function startup() {
    // Setup a timer to periodically (in ms) update the dataset and graphs
    myTimer = setInterval(timerFunction, updateDelay);

    // Setup event listeners
    // Login
    document.querySelector("#loginBtn").addEventListener("click", login);
    // Extras
    document.querySelector("#logoutBtn").addEventListener("click", logout);
    document
        .querySelector("#newCodeBtn")
        .addEventListener("click", newAccessCode);
    document
        .querySelector("#closeExtrasBtn")
        .addEventListener("click", closeExtrasPanel);
    document.querySelector("#uploadBtn").addEventListener("click", uploadJSON);
    // Help
    document
        .querySelector("#closeHelpBtn")
        .addEventListener("click", closeHelpPanel);
    // Main Buttons
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

    // Connect to WebSocket
    setupWebsocket(wsUrl);
    // setupWebsocket("ws://localhost:8080/");

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
    // dweetData = await getDweet(getUrl);
    // dweetContent = dweetData.with[0].content;
    // let isNewData = extractDweet(dweetContent);

    // if (isNewData && !jQuery.isEmptyObject(dweetContent)) {
    //     updateGraphs(dweetDataSet);
    //     if (lapData.isNewLap) {
    //         // updateTable(lapData);
    //     }
    //     updateTrack(dweetDataSet);
    //     checkNewLap(dweetDataSet);
    // }

    if (!jQuery.isEmptyObject(dweetDataSet.time)) {
        updateGraphs(dweetDataSet);
        updateTrack(dweetDataSet);
        checkNewLap(dweetDataSet);
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

        idForm.value = "";
        codeForm.value = "";

        M.Toast.dismissAll();
        M.toast({
            html: "Logged In as " + racerId,
            classes: "green",
        });

        console.log(racerId, "logged in");
    } else {
        codeForm.value = "";
        codeForm.focus();

        M.Toast.dismissAll();
        M.toast({ html: "Incorrect Access Code", classes: "red lighten-2" });

        console.log("Incorrect Access Code");
    }
}

// Logout of the site
function logout() {
    reset();
    racerId = "default_racer";

    let loginPanel = document.querySelector("#loginPanel");
    loginPanel.style.visibility = "visible";
    document.querySelector("#racer_id").focus();

    M.Toast.dismissAll();
    M.toast({
        html: "Logged Out",
        classes: "green",
    });

    console.log(racerId, "logged out");
}

// Changes the access code
function newAccessCode() {
    let codeText = document.querySelector("#new_access_code");
    accessCode = codeText.value;
    codeText.value = "";

    M.Toast.dismissAll();
    M.toast({
        html: "Access Code Changed",
        classes: "green",
    });

    console.log("Access code changed to", accessCode);
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
    isUploaded = false;
    atLapStart = true;

    // Reset data
    dweetDataSet = {
        accelX: [],
        accelY: [],
        accelZ: [],
        brake: [],
        gas: [],
        lat: [],
        lon: [],
        time: [],
        vel: [],
        wheel: [],
        bat: [],
    };

    lapData = {
        isNewLap: false,
        lapNum: 1,
        time: [],
        lat: [],
        lon: [],
    };

    // TESTING---------------------------------------------------
    // runTestCode();
    dweetRandomData();

    // Reset graphs
    updateGraphs(dweetDataSet);

    // Reset table----------------------------------------------------------------------
    updateTable(lapData, dweetDataSet);

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

// Uploads JSON text
function uploadJSON() {
    let jsonText = document.querySelector("#jsonText");
    uploadedDataset = JSON.parse(jsonText.value);

    jsonText.value = "";

    reset();

    inSession = false;
    isUploaded = true;

    updateGraphs(uploadedDataset);
    updateTrack(uploadedDataset);
    checkNewLap(uploadedDataset);

    dweetDataSet = uploadedDataset;

    console.log("JSON Data Uploaded");
}

// Shows the extras panel
function showExtrasPanel() {
    let extrasPanel = document.querySelector("#extrasPanel");
    if (extrasPanel.style.visibility == "visible") {
        closeExtrasPanel();
    } else {
        extrasPanel.style.visibility = "visible";
        extrasPanel.style.left = "0vw";
        document.querySelector("#helpPanel").style.visibility = "hidden";
    }
    console.log("Extras Panel");
}

// Shows the help panel
function showHelpPanel() {
    let helpPanel = document.querySelector("#helpPanel");
    if (helpPanel.style.visibility == "visible") {
        closeHelpPanel();
    } else {
        helpPanel.style.visibility = "visible";
        helpPanel.style.left = "0vw";
        document.querySelector("#extrasPanel").style.visibility = "hidden";
    }
    console.log("Help Panel");
}

// Closes the extras panel
function closeExtrasPanel() {
    let extrasPanel = document.querySelector("#extrasPanel");
    extrasPanel.style.left = "100vw";
    extrasPanel.style.visibility = "hidden";
}

// Closes the help panel
function closeHelpPanel() {
    let helpPanel = document.querySelector("#helpPanel");
    helpPanel.style.left = "100vw";
    helpPanel.style.visibility = "hidden";
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
        text: "mph",
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

    var accelZTrace = {
        x: data.time,
        y: data.accelZ,
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
        name: "Z-Axis Acceleration",
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
    var accelZData = [accelZTrace];
    var gasData = [gasTrace];
    var brakeData = [brakeTrace];
    var steerData = [steerTrace];

    // Plot data on graphs
    Plotly.newPlot("velocityGraph", velData, layout, { responsive: true });
    Plotly.newPlot("accelYGraph", accelYData, layout, { responsive: true });
    Plotly.newPlot("accelXGraph", accelXData, layout, { responsive: true });
    Plotly.newPlot("accelZGraph", accelZData, layout, { responsive: true });
    Plotly.newPlot("gasGraph", gasData, layout, { responsive: true });
    Plotly.newPlot("brakeGraph", brakeData, layout, { responsive: true });
    Plotly.newPlot("steeringGraph", steerData, layout, { responsive: true });

    // TESTING
    let batBar = document.querySelector("#batteryBar");
    let batPercentage = dweetDataSet.bat[dweetDataSet.bat.length - 1];
    batPercentage = ((batPercentage - 160000) / (185000 - 160000)) * 100;
    batBar.style.height = "40px";
    batBar.style.width = `${batPercentage}%`;
    batBar.innerHTML = `<b>${Math.floor(batPercentage)}%</b>`;
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
        if (data.vel[i] < 0 || !data.vel[i]) {
            // If negative velocity
            color = "#ffffff";
        } else if (data.vel[i] < 10) {
            color = "#ff2e2e";
        } else if (data.vel[i] < 20) {
            color = "#ff512e";
        } else if (data.vel[i] < 30) {
            color = "#ff742e";
        } else if (data.vel[i] < 40) {
            color = "#ff972e";
        } else if (data.vel[i] < 50) {
            color = "#ffb92e";
        } else if (data.vel[i] < 60) {
            color = "#ffdc2e";
        } else if (data.vel[i] < 70) {
            color = "#ffff2e";
        } else if (data.vel[i] < 80) {
            color = "#dcff2e";
        } else if (data.vel[i] < 90) {
            color = "#b9ff2e";
        } else if (data.vel[i] < 100) {
            color = "#b9ff2e";
        } else if (data.vel[i] > 100) {
            color = "#74ff2e";
        } else {
            // If other velocity
            color = "#c233ff";
        }

        newPoint.style.backgroundColor = color;
        newPoint.style.left = exLat[i] + "%";
        newPoint.style.bottom = exLon[i] + "%";
        document.querySelector("#mapArea").append(newPoint);
    }

    // Set custom first/current track point
    if ((inSession || isUploaded) && data.lat.length > 1) {
        // Get first and last track points
        let firstPoint = document.querySelector("#mapArea").firstElementChild;
        let lastPoint = document.querySelector("#mapArea").lastElementChild;

        // Create template for new custom point
        let customPoint = document.createElement("img");
        customPoint.className = "track";
        customPoint.style.backgroundColor = "transparent";
        customPoint.style.borderRadius = "0px";
        customPoint.style.height = "2vw";
        customPoint.style.width = "auto";
        customPoint.style.zIndex = "999999";

        // Apply new finish line point
        customPoint.src = "trackFinish.png";
        customPoint.style.left = firstPoint.style.left;
        customPoint.style.bottom = firstPoint.style.bottom;
        firstPoint.parentNode.replaceChild(customPoint, firstPoint);

        // Apply new current position point
        customPoint2 = customPoint.cloneNode();
        customPoint2.src = "trackLatest.png";
        customPoint2.style.left = lastPoint.style.left;
        customPoint2.style.bottom = lastPoint.style.bottom;
        lastPoint.parentNode.replaceChild(customPoint2, lastPoint);
    }
}

// Updates the lap time table and calculations
function updateTable(lapData, data) {
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
    let rowData = [];
    sectionTimes = [];
    let lapOffset = 0;

    for (let i = 1; i < lapData.time.length; i++) {
        // Calculate lap time
        let lapTime =
            rowData.length == 0
                ? lapData.time[i] - lapData.time[0]
                : lapData.time[i] - lapData.time[i - 1];

        // Calculate section times
        sectionTimes.push(data.time.findIndex((val) => val == lapData.time[i]));

        let section1 =
            data.time[Math.floor((sectionTimes[i - 1] / 5) * 1)] - data.time[0];
        let section2 =
            data.time[Math.floor((sectionTimes[i - 1] / 5) * 2)] -
            data.time[0] -
            lapOffset;
        let section3 =
            data.time[Math.floor((sectionTimes[i - 1] / 5) * 3)] -
            data.time[0] -
            lapOffset;
        let section4 =
            data.time[Math.floor((sectionTimes[i - 1] / 5) * 4)] -
            data.time[0] -
            lapOffset;
        let section5 =
            data.time[Math.floor((sectionTimes[i - 1] / 5) * 5)] -
            data.time[0] -
            lapOffset;

        // TESTING
        subsection1 = section1;
        subsection2 = section2;
        subsection3 = section3;
        subsection4 = section4;
        subsection5 = section5;

        // TESTING temp fix to lapData problem
        if (i > 1) {
            subsection1 = section1 - rowData[i - 2].ls1 * (i - 1);
            subsection2 = section2 - rowData[i - 2].ls2 * (i - 1);
            subsection3 = section3 - rowData[i - 2].ls3 * (i - 1);
            subsection4 = section4 - rowData[i - 2].ls4 * (i - 1);
            subsection5 = section5 - rowData[i - 2].ls5 * (i - 1);
        }

        rowData[i - 1] = {
            lapNumber: i,
            lapTime: lapTime,
            ls1: subsection1.toFixed(3),
            ls2: (subsection2 - section1).toFixed(3),
            ls3: (subsection3 - section2).toFixed(3),
            ls4: (subsection4 - section3).toFixed(3),
            ls5: (subsection5 - section4).toFixed(3),
        };

        // lapOffset = ;
        // console.log(rowData);

        // Check Total
        // console.log(
        //     `Lap ${i} Total:`,
        //     rowData[i].ls +
        //         rowData[i].ls2 +
        //         rowData[i].ls3 +
        //         rowData[i].ls4 +
        //         rowData[i].ls5
        // );
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
    rowDataSum = 0;
    rowDataset = [];
    for (let i = 0; i < rowData.length; i++) {
        rowDataSum = rowDataSum + parseFloat(rowData[i].lapTime);
        rowDataset.push(rowData[i].lapTime);
    }
    rowDataAvg = rowDataSum / rowData.length;
    rowDataMin = Math.min(...rowDataset);
    rowDataMax = Math.max(...rowDataset);

    document.getElementById(
        "lapTimes"
    ).innerHTML = `Average Lap Time: ${rowDataAvg.toFixed(
        2
    )} s<br />Minimum Lap Time: ${rowDataMin.toFixed(
        2
    )} s<br />Maximum Lap Time: ${rowDataMax.toFixed(2)} s`;
}

// Checks if a new lap has started and updates lap data
function checkNewLap(data) {
    let isNewLap = false;
    atLapStart = true;

    lapData.time = [data.time[0]];

    // TESTING lap
    for (let i = 0; i < data.lat.length; i++) {
        let newLat = data.lat[i];
        let newLon = data.lon[i];
        let distance = getDistance(
            data.lat[0],
            data.lon[0],
            data.lat[i],
            data.lon[i]
        );

        let startAreaRadius = 2;
        // TESTING
        // startAreaRadius = 5000;

        // Check if leaving starting zone
        if (distance > startAreaRadius && atLapStart) {
            atLapStart = false;
            console.log("Left Starting Area . . .");
        }

        // Check if entering starting zone
        if (distance < startAreaRadius && !atLapStart) {
            atLapStart = true;
            isNewLap = true;
            console.log("Re-Entered Starting Area . . .");
        }

        // Check if new lap
        if (isNewLap && atLapStart) {
            lapData.time.push(data.time[i]);
            lapData.isNewLap = true;
            lapData.lapNum += 1;
            isNewLap = false;

            console.log(
                "New Lap at",
                i,
                "of",
                newLat,
                "and",
                newLon,
                "with",
                data.lat[0],
                "and",
                data.lon[0],
                distance
            );
        }
    }

    if ((lapData.isNewLap = true)) {
        updateTable(lapData, data);
        lapData.isNewLap = false;
        // lapData.time = [];
        // lapData.lat = [];
        // lapData.lon = [];
        // lapData = {
        //     isNewLap: false,
        //     lapNum: 1,
        //     time: [],
        //     lat: [],
        //     lon: [],
        // };
    }

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

// Calculates the distance from Lon and Lat data points in a dataset
function getDistance2(coords) {
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

// Gets data from latest dweet and updates current dataset
function extractDweet(dweet) {
    // Add dweet content to dataset if not a repeat
    if (jQuery.isEmptyObject(dweet)) {
        console.log("No Data Received");
        return false;
    } else if (!dweetDataSet.time.includes(Object.keys(dweet)[0] / 1000)) {
        for (var prop in dweet) {
            let propData = dweet[prop].split(",");

            // Check if new lap
            // newLap(propData);

            // store dataset values
            dweetDataSet.wheel.push(propData[0]);
            dweetDataSet.gas.push(propData[1]);
            dweetDataSet.brake.push(propData[2]);
            dweetDataSet.accelX.push(propData[3]);
            dweetDataSet.accelY.push(propData[4]);
            dweetDataSet.accelZ.push(propData[5]);
            dweetDataSet.lat.push(propData[6]);
            dweetDataSet.lon.push(propData[7]);
            dweetDataSet.vel.push((propData[8] / 1000) * 2.237);
            dweetDataSet.time.push(prop / 1000);

            // calc and store velocity
            // let velocity = calcVel();
            // dweetDataSet.vel.push(velocity.toFixed(2));
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
    updateTable(lapData, dweetDataSet);
}
