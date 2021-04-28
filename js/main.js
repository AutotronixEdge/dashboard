// Run at startup
async function startup() {
    // Setup a timer to periodically (in ms) update the dataset and graphs
    myTimer = setInterval(timerFunction, updateDelay);

    // Setup event listeners
    // Login
    document.querySelector("#racer_id").addEventListener("keyup", checkEnter);
    document
        .querySelector("#access_code")
        .addEventListener("keyup", checkEnter);
    document.querySelector("#loginBtn").addEventListener("click", login);
    // Extras
    document.querySelector("#logoutBtn").addEventListener("click", logout);
    document
        .querySelector("#newCodeBtn")
        .addEventListener("click", newAccessCode);
    document
        .querySelector("#flushBtn")
        .addEventListener("click", flushDatabase);
    document
        .querySelector("#closeExtrasBtn")
        .addEventListener("click", closeExtrasPanel);
    document.querySelector("#uploadBtn").addEventListener("click", uploadJSON);
    $(".dropdown-trigger").dropdown();
    document
        .querySelector("#compToggle")
        .addEventListener("click", function () {
            isDataCompare = document.querySelector("#compToggle").checked;
        });
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

    // Initial reset
    reset();

    // Connect to WebSocket
    setupWebsocket(wsUrl);

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
    if (!jQuery.isEmptyObject(dataset.time)) {
        updateGraphs(dataset);
        updateTrack(dataset);
        checkNewLap(dataset);
        newDataReceived = true;
    }
}

// Checks if enter is pressed on login fields
function checkEnter(e) {
    if (e.keyCode === 13) {
        // Cancel the default action, if needed
        e.preventDefault();
        // Trigger login button
        document.getElementById("loginBtn").click();
    }
}

// Login to the site
async function login() {
    // Get form values
    let idForm = document.querySelector("#racer_id");
    let codeForm = document.querySelector("#access_code");
    accessCode = await getData(fbUrl, "/Settings");
    accessCode = accessCode.access_code;

    // Check access code
    if (codeForm.value == accessCode) {
        if (idForm.value != "") {
            racerId = idForm.value;
        }
        let loginPanel = document.querySelector("#loginPanel");
        loginPanel.style.visibility = "hidden";

        idForm.value = "";
        codeForm.value = "";

        document.querySelector("#racerLabel").innerHTML =
            "<b>Racer ID:</b> " + racerId;

        M.Toast.dismissAll();
        M.toast({
            html: "Logged In as " + racerId,
            classes: "green",
        });

        isLoggedIn = true;

        setupSessionSelector();

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
    isLoggedIn = false;

    racerId = "default_racer";

    reset();

    document.querySelector("#racerLabel").innerHTML =
        "<b>Racer ID:</b> " + racerId;

    let loginPanel = document.querySelector("#loginPanel");
    loginPanel.style.visibility = "visible";
    document.querySelector("#racer_id").focus();

    M.Toast.dismissAll();
    M.toast({
        html: "Logged Out",
        classes: "green",
    });

    closeExtrasPanel();

    console.log(racerId, "logged out");
}

// Changes the access code
function newAccessCode() {
    let codeText = document.querySelector("#new_access_code");
    accessCode = codeText.value;
    patchData(fbUrl, "/Settings", "access_code", accessCode);
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
        // Start
        stopBtn.classList.remove("green");
        stopBtn.classList.add("orange");
        inSession = true;
        stopBtn.innerHTML = "stop";

        console.log("Start");
    } else {
        // Stop
        stopBtn.classList.remove("orange");
        stopBtn.classList.add("green");
        inSession = false;
        stopBtn.innerHTML = "start";

        if (newDataReceived) {
            patchData(fbUrl, "", racerId + "/Dataset/" + sessionId, dataset);
            console.log("Data uploaded");
            getSessionInfo(dataset);
        }

        console.log("Stop");
    }
}

// Reset data and graphs
function reset(e) {
    inSession = false;
    isUploaded = false;
    atLapStart = true;
    newDataReceived = false;
    isDataCompare = false;
    startFirstLap = false;

    if (isLoggedIn) {
        setupSessionSelector();
    }

    // Reset data
    dataset = {
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

    compareData = {
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
        latMin: 0,
        latMax: 0,
        lonMin: 0,
        lonMax: 0,
    };

    // Erase hover area
    let hoverArea = document.querySelector("#trackHoverArea");
    hoverArea.style.visibility = "hidden";
    document.querySelector("#trackHoverArea").innerHTML = "";

    // Reset graphs
    updateGraphs(dataset);

    // Reset table
    updateTable(lapData, dataset);

    // Reset track
    updateTrack(dataset);

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
        encodeURIComponent(JSON.stringify(dataset));
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

    dataset = uploadedDataset;

    closeExtrasPanel();

    console.log("JSON Data Uploaded");
}

// Sets up the session selector
async function setupSessionSelector() {
    // Get past session data
    let racerData = await getData(fbUrl, `/${racerId}`);
    // Get session list area
    let listArea = document.querySelector("#sessionList");
    listArea.innerHTML = "";

    // Check--------------------------
    if (racerData) {
        // Create button for each session
        for (let i = 0; i < Object.keys(racerData.Dataset).length; i++) {
            // Create session list
            let sessionLi = document.createElement("li");

            // Create session button
            let sessionBtn = document.createElement("a");
            sessionBtn.href = "#!";
            let ms = Object.keys(racerData.Dataset)[i].slice(7);
            let s = Math.floor(ms / 1000);
            let m = Math.floor(s / 60);
            s = s % 60;
            let h = Math.floor(m / 60);
            m = m % 60;
            let d = Math.floor(h / 24);
            h = (h + 19) % 24;
            d = (d - 12) % 365;
            let sessionTime = d + ":" + h + ":" + m + ":" + s;
            sessionBtn.innerHTML =
                Object.keys(racerData.Dataset)[i] + " - " + sessionTime;

            // Create event listener for each session button
            sessionBtn.addEventListener("click", function () {
                inSession = false;
                isUploaded = true;

                let sessionData =
                    racerData.Dataset[Object.keys(racerData.Dataset)[i]];

                isDataCompare
                    ? (compareData = sessionData)
                    : (dataset = sessionData);

                refresh();

                if (isDataCompare) updateTrack(compareData, true);

                closeExtrasPanel();

                console.log(`${Object.keys(racerData.Dataset)[i]} selected`);
            });

            // Place session buttons in list
            sessionLi.appendChild(sessionBtn);
            listArea.appendChild(sessionLi);
        }

        M.Toast.dismissAll();
        M.toast({
            html: "Fetched Session Data",
            classes: "blue",
        });

        console.log(`Fetched session data for ${racerId}`);
    } else {
        console.log(`No session data to fetch for ${racerId}`);
    }
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
    deleteData(fbUrl, "", racerId);

    M.Toast.dismissAll();
    M.toast({
        html: "Erased " + racerId + "'s Sessions",
        classes: "red",
    });

    console.log("Flushed Database");
}

// Updates graphs
function updateGraphs(data) {
    // Check for empty data points
    if (!data.vel) data.vel = [];
    if (!data.accelY) data.accelY = [];
    if (!data.accelX) data.accelX = [];
    if (!data.accelZ) data.accelZ = [];
    if (!data.gas) data.gas = [];
    if (!data.brake) data.brake = [];
    if (!data.wheel) data.wheel = [];

    if (isDataCompare) {
        if (!compareData.vel) compareData.vel = [];
        if (!compareData.accelY) compareData.accelY = [];
        if (!compareData.accelX) compareData.accelX = [];
        if (!compareData.accelZ) compareData.accelZ = [];
        if (!compareData.gas) compareData.gas = [];
        if (!compareData.brake) compareData.brake = [];
        if (!compareData.wheel) compareData.wheel = [];
    }

    // Offset initial time
    let time = [];
    let compareTime = [];
    if (data.time[0]) {
        time = [...data.time];
        let initialTime = time[0];
        time = time.map((t) => t - initialTime);
    }
    if (compareData.time[0]) {
        compareTime = [...compareData.time];
        let compareInitialTime = compareTime[0];
        compareTime = compareTime.map((t) => t - compareInitialTime);
    }

    // Trace settings
    mainColor = "red";
    compareColor = "cyan";
    traceMode = "lines";
    tracePointWidth = 6;
    traceWidth = 2;

    // Main data
    var velTrace = {
        x: time,
        y: data.vel,
        mode: traceMode,
        marker: {
            color: mainColor,
            size: tracePointWidth,
        },
        line: {
            color: mainColor,
            width: traceWidth,
            shape: "spline",
        },
        text: "mph",
        name: "Main",
    };

    var accelYTrace = {
        x: time,
        y: data.accelY,
        mode: traceMode,
        marker: {
            color: mainColor,
            size: tracePointWidth,
        },
        line: {
            color: mainColor,
            width: traceWidth,
            shape: "spline",
        },
        text: "g",
        name: "Main",
    };

    var accelXTrace = {
        x: time,
        y: data.accelX,
        mode: traceMode,
        marker: {
            color: mainColor,
            size: tracePointWidth,
        },
        line: {
            color: mainColor,
            width: traceWidth,
            shape: "spline",
        },
        text: "g",
        name: "Main",
    };

    var accelZTrace = {
        x: time,
        y: data.accelZ,
        mode: traceMode,
        marker: {
            color: mainColor,
            size: tracePointWidth,
        },
        line: {
            color: mainColor,
            width: traceWidth,
            shape: "spline",
        },
        text: "g",
        name: "Main",
    };

    var gasTrace = {
        x: time,
        y: data.gas,
        mode: traceMode,
        marker: {
            color: mainColor,
            size: tracePointWidth,
        },
        line: {
            color: mainColor,
            width: traceWidth,
            shape: "spline",
        },
        text: "mm",
        name: "Main",
    };

    var brakeTrace = {
        x: time,
        y: data.brake,
        mode: traceMode,
        marker: {
            color: mainColor,
            size: tracePointWidth,
        },
        line: {
            color: mainColor,
            width: traceWidth,
            shape: "spline",
        },
        text: "mm",
        name: "Main",
    };

    var steerTrace = {
        x: time,
        y: data.wheel,
        mode: traceMode,
        marker: {
            color: mainColor,
            size: tracePointWidth,
        },
        line: {
            color: mainColor,
            width: traceWidth,
            shape: "spline",
        },
        text: "degrees",
        name: "Main",
    };

    // Compare data
    if (isDataCompare) {
        var velTrace2 = {
            x: compareTime,
            y: compareData.vel,
            mode: traceMode,
            marker: {
                color: compareColor,
                size: tracePointWidth,
            },
            line: {
                color: compareColor,
                width: traceWidth,
                shape: "spline",
            },
            text: "mph",
            name: "Compare",
        };

        var accelYTrace2 = {
            x: compareTime,
            y: compareData.accelY,
            mode: traceMode,
            marker: {
                color: compareColor,
                size: tracePointWidth,
            },
            line: {
                color: compareColor,
                width: traceWidth,
                shape: "spline",
            },
            text: "g",
            name: "Compare",
        };

        var accelXTrace2 = {
            x: compareTime,
            y: compareData.accelX,
            mode: traceMode,
            marker: {
                color: compareColor,
                size: tracePointWidth,
            },
            line: {
                color: compareColor,
                width: traceWidth,
                shape: "spline",
            },
            text: "g",
            name: "Compare",
        };

        var accelZTrace2 = {
            x: compareTime,
            y: compareData.accelZ,
            mode: traceMode,
            marker: {
                color: compareColor,
                size: tracePointWidth,
            },
            line: {
                color: compareColor,
                width: traceWidth,
                shape: "spline",
            },
            text: "g",
            name: "Compare",
        };

        var gasTrace2 = {
            x: compareTime,
            y: compareData.gas,
            mode: traceMode,
            marker: {
                color: compareColor,
                size: tracePointWidth,
            },
            line: {
                color: compareColor,
                width: traceWidth,
                shape: "spline",
            },
            text: "mm",
            name: "Compare",
        };

        var brakeTrace2 = {
            x: compareTime,
            y: compareData.brake,
            mode: traceMode,
            marker: {
                color: compareColor,
                size: tracePointWidth,
            },
            line: {
                color: compareColor,
                width: traceWidth,
                shape: "spline",
            },
            text: "mm",
            name: "Compare",
        };

        var steerTrace2 = {
            x: compareTime,
            y: compareData.wheel,
            mode: traceMode,
            marker: {
                color: compareColor,
                size: tracePointWidth,
            },
            line: {
                color: compareColor,
                width: traceWidth,
                shape: "spline",
            },
            text: "degrees",
            name: "Compare",
        };
    }

    // Define graph layout
    var layout = {
        // title: "Vehicle Data Graph",
        xaxis: {
            title: "",
            // range: [
            //     data.time[data.time.length - 1] - 30 - data.time[0],
            //     data.time[data.time.length - 1] - data.time[0],
            // ], //Constant Range
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

    // Add compare data if available
    if (isDataCompare) {
        velData.push(velTrace2);
        accelYData.push(accelYTrace2);
        accelXData.push(accelXTrace2);
        accelZData.push(accelZTrace2);
        gasData.push(gasTrace2);
        brakeData.push(brakeTrace2);
        steerData.push(steerTrace2);
    }

    // Plot data on graphs
    Plotly.newPlot("velocityGraph", velData, layout, { responsive: true });
    Plotly.newPlot("accelYGraph", accelYData, layout, { responsive: true });
    Plotly.newPlot("accelXGraph", accelXData, layout, { responsive: true });
    Plotly.newPlot("accelZGraph", accelZData, layout, { responsive: true });
    Plotly.newPlot("gasGraph", gasData, layout, { responsive: true });
    Plotly.newPlot("brakeGraph", brakeData, layout, { responsive: true });
    Plotly.newPlot("steeringGraph", steerData, layout, { responsive: true });

    // Battery bar
    let batBar = document.querySelector("#batteryBar");
    // Check if battery value exists
    let batPercentage;
    try {
        batPercentage = dataset.bat[dataset.bat.length - 1];
    } catch {
        batPercentage = 160000;
    }
    batPercentage = ((batPercentage - 16000) / (18500 - 16000)) * 100;
    batBar.style.height = "40px";
    batBar.style.width = `${batPercentage}%`;
    batBar.innerHTML = `<b>${Math.floor(batPercentage)}%</b>`;
}

// Updates the track
function updateTrack(data, compare) {
    if (!isDataCompare) $(".track").remove();

    exLat = [...data.lat]; //x
    exLon = [...data.lon]; //y

    exLatMin = Math.min(...exLat);
    exLonMin = Math.min(...exLon);

    // Set compare track min offsets
    if (!compare) {
        lapData.latMin = exLatMin;
        lapData.lonMin = exLonMin;
    } else {
        exLatMin = lapData.latMin;
        exLonMin = lapData.lonMin;
    }

    exLat = exLat.map((x) => (x = x - exLatMin));
    exLon = exLon.map((x) => (x = x - exLonMin));

    exLatMax = Math.max(...exLat);
    exLonMax = Math.max(...exLon);

    // Set compare track max offsets
    if (!compare) {
        lapData.latMax = exLatMax;
        lapData.lonMax = exLonMax;
    } else {
        exLatMax = lapData.latMax;
        exLonMax = lapData.lonMax;
    }

    exLat = exLat.map((x) => (x = (x / exLatMax) * 90 + 5));
    exLon = exLon.map((x) => (x = (x / exLonMax) * 80 + 5));

    color = "";
    for (let i = 0; i < exLat.length; i++) {
        let newPoint = document.createElement("div");
        newPoint.className = "track";

        // Set velocity color
        // if (data.vel[i] < 0 || !data.vel[i]) {
        //     // If negative velocity
        //     color = "#ffffff";
        // } else if (data.vel[i] < 10) {
        //     color = "#ff2e2e";
        // } else if (data.vel[i] < 20) {
        //     color = "#ff512e";
        // } else if (data.vel[i] < 30) {
        //     color = "#ff742e";
        // } else if (data.vel[i] < 40) {
        //     color = "#ff972e";
        // } else if (data.vel[i] < 50) {
        //     color = "#ffb92e";
        // } else if (data.vel[i] < 60) {
        //     color = "#ffdc2e";
        // } else if (data.vel[i] < 70) {
        //     color = "#ffff2e";
        // } else if (data.vel[i] < 80) {
        //     color = "#dcff2e";
        // } else if (data.vel[i] < 90) {
        //     color = "#b9ff2e";
        // } else if (data.vel[i] < 100) {
        //     color = "#b9ff2e";
        // } else if (data.vel[i] > 100) {
        //     color = "#74ff2e";
        // } else {
        //     // If other velocity
        //     color = "#c233ff";
        // }

        // TESTING - demo colors
        if (data.vel[i] < 0 || !data.vel[i]) {
            // If negative velocity
            color = "#ffffff";
        } else if (data.vel[i] < 5) {
            color = "#fc0303";
        } else if (data.vel[i] < 10) {
            color = "#fc5603";
        } else if (data.vel[i] < 15) {
            color = "#ff742e";
        } else if (data.vel[i] < 20) {
            color = "#fca903";
        } else if (data.vel[i] < 25) {
            color = "#fcfc03";
        } else if (data.vel[i] < 30) {
            color = "#a9fc03";
        } else if (data.vel[i] < 35) {
            color = "#7ffc03";
        } else if (data.vel[i] < 40) {
            color = "#56fc03";
        } else if (data.vel[i] < 45) {
            color = "#2dfc03";
        } else {
            color = "#03fc03";
        }

        if (compare) color = "cyan";

        newPoint.style.backgroundColor = color;
        newPoint.style.right = exLat[i] + "%";
        newPoint.style.bottom = exLon[i] + "%";

        // Points hover event listeners
        newPoint.addEventListener("mouseover", function () {
            let hoverArea = document.querySelector("#trackHoverArea");
            let time = data.time[i];
            let velocity = data.vel[i];
            let accelY = data.accelY[i];
            let accelX = data.accelX[i];
            let gas = data.gas[i];
            let brake = data.brake[i];
            let wheel = data.wheel[i];
            let lat = data.lat[i];
            let lon = data.lon[i];

            // Print point data
            let hoverText = `Time: ${parseFloat(time - data.time[0]).toFixed(
                3
            )} s<br>`;
            hoverText += `Velocity: ${parseFloat(velocity).toFixed(3)} mph<br>`;
            hoverText += `Y Accel: ${parseFloat(accelY).toFixed(3)} g<br>`;
            hoverText += `X Accel: ${parseFloat(accelX).toFixed(3)} g<br>`;
            hoverText += `Gas Pedal: ${parseFloat(gas).toFixed(3)} mm<br>`;
            hoverText += `Brake Pedal: ${parseFloat(brake).toFixed(3)} mm<br>`;
            hoverText += `Steering Wheel: ${parseFloat(wheel).toFixed(
                3
            )} degrees<br>`;
            hoverText += `Position: ${parseFloat(lat)} and ${parseFloat(
                lon
            )}<br>`;
            hoverArea.innerHTML = hoverText;
            hoverArea.style.visibility = "visible";
        });
        newPoint.addEventListener("mouseout", function () {
            let hoverArea = document.querySelector("#trackHoverArea");
        });

        // Place point on track
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
        customPoint.style.top = "-350%";

        // Apply new finish line point
        customPoint.src = "trackFinish.png";
        // customPoint.style.left = firstPoint.style.left;
        // customPoint.style.bottom = firstPoint.style.bottom;
        // firstPoint.parentNode.replaceChild(customPoint, firstPoint);
        firstPoint.appendChild(customPoint);

        // Apply new current position point
        customPoint2 = customPoint.cloneNode();
        customPoint2.src = "trackLatest.png";
        // customPoint2.style.left = lastPoint.style.left;
        // customPoint2.style.bottom = lastPoint.style.bottom;
        // lastPoint.parentNode.replaceChild(customPoint2, lastPoint);
        lastPoint.appendChild(customPoint2);
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
        { headerName: "Lap Time [s]", field: "lapTime", width: colWidth },
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

        // Lap subsection offsets
        subsection1 = section1;
        subsection2 = section2;
        subsection3 = section3;
        subsection4 = section4;
        subsection5 = section5;

        // Fix to lap data increments
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
            ls1: subsection1.toFixed(9),
            ls2: (subsection2 - section1).toFixed(9),
            ls3: (subsection3 - section2).toFixed(9),
            ls4: (subsection4 - section3).toFixed(9),
            ls5: (subsection5 - section4).toFixed(9),
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

    // Run through dataset to check for laps
    for (let i = 0; i < data.lat.length; i++) {
        let newLat = data.lat[i];
        let newLon = data.lon[i];
        let distance = getDistance(
            data.lat[0],
            data.lon[0],
            data.lat[i],
            data.lon[i]
        );

        // Check if leaving starting zone
        if (distance > startAreaRadius && atLapStart) {
            atLapStart = false;
        }

        // Check if entering starting zone
        if (distance < startAreaRadius && !atLapStart) {
            atLapStart = true;
            isNewLap = true;
        }

        // Check if new lap
        if (isNewLap && atLapStart) {
            lapData.time.push(data.time[i]);
            lapData.isNewLap = true;
            lapData.lapNum += 1;
            isNewLap = false;
        }
    }

    // Update table if there is a new lap
    if ((lapData.isNewLap = true)) {
        updateTable(lapData, data);
        lapData.isNewLap = false;
    }

    return isNewLap;
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

// Sets up websocket connection and event listeners to collect data
function setupWebsocket(url) {
    // Create WebSocket connection.
    socket = new WebSocket(url);

    // Connection opened
    socket.addEventListener("open", function (event) {
        console.log("WebSocket Connected");
    });

    // Listen for messages
    socket.addEventListener("message", function (event) {
        if (inSession) {
            message = event.data;

            if (message == '{"connection" :"ok"}') {
                console.log("Connection: OK");
            } else {
                try {
                    parseData(message);
                } catch (e) {
                    console.log("Can't Parse Data . . .");
                }
            }
        }
    });

    socket.addEventListener("close", (event) => {
        console.log("The connection has been closed successfully.");
    });
}

function parseData(data) {
    let dataArray = data.split(",");
    if (
        Number.isInteger(Math.floor(dataArray[0])) &&
        Number.isInteger(Math.floor(dataArray[1])) &&
        Number.isInteger(Math.floor(dataArray[2])) &&
        Number.isInteger(Math.floor(dataArray[3])) &&
        Number.isInteger(Math.floor(dataArray[4])) &&
        Number.isInteger(Math.floor(dataArray[5])) &&
        Number.isInteger(Math.floor(dataArray[6])) &&
        Number.isInteger(Math.floor(dataArray[7])) &&
        Number.isInteger(Math.floor(dataArray[8])) &&
        Number.isInteger(Math.floor(dataArray[9])) &&
        Number.isInteger(Math.floor(dataArray[10]))
    ) {
        if (Math.abs(dataArray[4]) > startThreshold) {
            startFirstLap = startFirstLap || true;
        }

        if (startFirstLap) {
            dataset.time.push(dataArray[0] / 1000);

            dataset.wheel.push(dataArray[1] * 12);

            dataset.gas.push(dataArray[3]);
            dataset.brake.push(dataArray[2]);

            dataset.accelX.push(dataArray[4]);
            dataset.accelY.push(dataArray[5]);
            dataset.accelZ.push(dataArray[6]);

            dataset.lat.push(dataArray[7]);
            dataset.lon.push(dataArray[8]);

            dataset.vel.push(dataArray[9]);

            dataset.bat.push(dataArray[10]);
        }
    } else {
        garbageData++;
    }
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
    updateTable(lapData, dataset);
    // var cw = $(".map").width();
    // $(".map").css({
    //     height: cw * 0.75 + "px",
    // });
}

// Returns data collection statistics
function getSessionInfo(data) {
    let sessionInfo = {
        "Points per second":
            data.time.length / (data.time[data.time.length - 1] - data.time[0]),
        "Corruption %": (garbageData / data.time.length) * 100,
        "Time elapsed": data.time[data.time.length - 1] - data.time[0],
        "Total points": data.time.length,
    };

    console.log(sessionInfo);
}
