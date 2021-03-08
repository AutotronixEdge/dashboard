testVariable = "This is a test";

exLat2 = [0, 1, 2, 1, 0, -1, -2, -1]; //x
exLon2 = [2, 1, 0, -1, -2, -1, 0, 1]; //y

rowData2 = [
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

receivedDataStatic = {
    testEncoder: [0, 0, 3, 5, -5, 4, 0],
    testIR1: [0, 8, 5, 4, 4, 5, 9],
    testIR2: [10, 0, 0, 1, 1, 0, 0],
    testAccelX: [0, 0, 5, 8, -7, 5],
    testAccelY: [0, 10, 3, 3, 4, 6, 11],
    testLat: [1, 2, 3, 4, 5, 6, 7],
    testLon: [3, 4, 5, 5, 4, 4, 3],
    testVel: [0, 100, 75, 70, 70, 85, 120],
    testTime: [0, 25, 50, 75, 100, 125, 150],
};

addedValues = {
    0: [8, 3, 3, 0, 2, 8, 2, 60, 175],
    1: [3, 5, 0, 6, 6, 7, 1, 70, 200],
    2: [4, 4, 1, 5, 5, 5, 1, 80, 225],
    3: [-4, 4, 1, -4, 5, 4, 2, 65, 275],
    4: [-4, 4, 1, -4, 5, 2, 2, 65, 275],
    5: [-4, 4, 1, -4, 5, 1, 3, 65, 300],
};

// <------------------------------> Old HTTP Request Method <------------------------------>
// var userName = "dannyharris2";
//     var passWord = "oi6ZeQBvC95NuD1XvR8GJKzxtFZP6n";

//     function authenticateUser(user, password) {
//         var token = user + ":" + password;
//         var hash = btoa(token);

//         return "Basic " + hash;
//     }

//     function CallWebAPI() {
//         // New XMLHTTPRequest
//         var request = new XMLHttpRequest();
//         request.open(
//             "GET",
//             "https://dry-eyrie-70197.herokuapp.com/https://rest.textmagic.com/api/v2/replies",
//             false
//         );
//         request.setRequestHeader(
//             "Authorization",
//             authenticateUser(userName, passWord)
//         );
//         request.send();
//         let testVar = request.response;
//         testVar = JSON.parse(testVar);
//         document.getElementById("map").innerHTML = testVar.resources[0].text;
//     }
//     CallWebAPI();

// <------------------------------> Original Velocity Equation <------------------------------>
// return 6371000 * degToRad * Math.sqrt(Math.pow(Math.cos(point1.lat * degToRad ) * (point1.lng - point2.lng) , 2) + Math.pow(point1.lat - point2.lat, 2));

// Fetch Request to
// fetch("https://autotronixedge.github.io/dashboard/")
//     .then((response) => response.text())
//     .then((data) => console.log(data));

// fetch(
//     "https://dry-eyrie-70197.herokuapp.com/https://autotronix-test-database-default-rtdb.firebaseio.com/dataSet1.json"
// )
//     .then((response) => response.json())
//     .then((data) => console.log(data));

// window.location.replace(
//     "https://autotronix-test-database-default-rtdb.firebaseio.com/.json"
// );

testUrl = "https://dweet.io/dweet/for/testThing2pointOh";
async function dweetGet(urlAddon = "", log) {
    dweet = await fetch(urlAddon).then((response) => response.json());

    if (log) {
        console.log(dweet.with[0].content);
    }
}
// postData(JSON.stringify({ testName: "testValue" }));
dweetGet(
    "https://dweet.io/dweet/for/testThing2pointOh?name1=value1&name2=value2"
);
dweetGet("https://dweet.io/get/latest/dweet/for/testThing2pointOh", true);

// Example POST method implementation:
async function postData(data = "") {
    // url = "https://autotronix-test-database-default-rtdb.firebaseio.com/.json";
    url = "https://dweet.io/dweet/for/testThing2pointOh";

    // Default options are marked with *
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        // mode: "cors", // no-cors, *cors, same-origin
        // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: "same-origin", // include, *same-origin, omit
        // headers: {
        //     "Content-Type": "application/json",
        //     // 'Content-Type': 'application/x-www-form-urlencoded',
        // },
        // redirect: "follow", // manual, *follow, error
        // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        // body: JSON.stringify(data), // body data type must match "Content-Type" header
        body: JSON.parse(data),
    });
    // return response.json(); // parses JSON response into native JavaScript objects
}

// postData(
//     "https://dry-eyrie-70197.herokuapp.com/https://autotronix-test-database-default-rtdb.firebaseio.com/.json",
//     { question: "life?", answer: 42 }
// ).then((data) => {
//     console.log(data);
// });
