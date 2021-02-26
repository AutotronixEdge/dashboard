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
