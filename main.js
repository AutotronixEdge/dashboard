// Run at Startup
function startup() {
    myTimer = setInterval(timerFunction, 100);

    inSession = false;

    myData = getBaseline();
    updatePlotly(myData);

    function timerFunction() {
        if (inSession) {
            updatePlotly(myData);
        }
    }

    // TABLE STUFF-----------------------------------------------------------------
    var columnDefs = [
        { headerName: "#", field: "lapNumber", width: 50 },
        { headerName: "Lap Time", field: "lapTime", width: 100 },
        { headerName: "S1", field: "ls1", width: 100 },
        { headerName: "S2", field: "ls2", width: 100 },
        { headerName: "S3", field: "ls3", width: 100 },
        { headerName: "S4", field: "ls4", width: 100 },
        { headerName: "S5", field: "ls5", width: 100 },
    ];

    // specify the data
    var rowData = [
        { lapNumber: 1, lapTime: "4:10", ls1: "1:10" },
        { lapNumber: 2, lapTime: "3:30", ls1: "1:00" },
        { lapNumber: 3, lapTime: "3:45", ls1: "1:10" },
        { lapNumber: 4, lapTime: "3:45", ls1: "1:10" },
        { lapNumber: 5, lapTime: "3:45", ls1: "1:10" },
        { lapNumber: 6, lapTime: "3:45", ls1: "1:10" },
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

    // function sizeToFit() {
    //     gridOptions.api.sizeColumnsToFit();
    // }
    // sizeToFit();
    // gridApi.sizeColumnsToFit();
    // gridOptions.sizeColumnsToFit();
    // gridOptions.api.sizeColumnsToFit();
    // TABLE STUFF-----------------------------------------------------------------
}

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

function updatePlotly(myData) {
    // Generated Data
    myData.x.push(myData.x[myData.x.length - 1] + 1);
    myData.y1.push(50 * Math.sin(myData.x[myData.x.length - 1]) + 100);
    myData.y2.push(100 * Math.cos(myData.x[myData.x.length - 1]) + 100);
    myData.time.push(
        [new Date().getMinutes(), new Date().getSeconds()].join(":")
    );

    // Update Graphs
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
        text: "mph",
        name: "Velocity",
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
        text: "m/s^2",
        name: "Acceleration",
    };

    var layout = {
        // title: "Vehicle Data Graph",
        xaxis: {
            title: "time (s)",
            range: [0, 200], //Constant Range
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
            title: "Velocity & Acceleration",
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
            l: 45,
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

    var data = [velTrace, accelTrace];

    Plotly.newPlot("gasGraph", data, layout, { responsive: true });
    Plotly.newPlot("brakeGraph", data, layout, { responsive: true });
    Plotly.newPlot("accelXGraph", data, layout, { responsive: true });
    Plotly.newPlot("steeringGraph", data, layout, { responsive: true });
    Plotly.newPlot("accelYGraph", data, layout, { responsive: true });
    Plotly.newPlot("velocityGraph", data, layout, { responsive: true });
}

function startStopGraph() {
    inSession = !inSession;
    console.log("Start / Stop");
}

function resetGraph() {
    myData = getBaseline();
    inSession = false;
    updatePlotly(myData);
    console.log("Reset");
}
