function testJS() {
    // Make HTTP Request to TextMagic-------------------------------------------------------------------------
    // const Http = new XMLHttpRequest();
    // const url =
    //     "https://dry-eyrie-70197.herokuapp.com/https://rest.textmagic.com/api/v2/replies";
    // const user = "dannyharris2";
    // const password = "oi6ZeQBvC95NuD1XvR8GJKzxtFZP6n";
    // Http.open("GET", url, true, user, password);
    // Http.send();
    // Http.onreadystatechange = (e) => {
    //     console.log(Http.respondText);
    // };
    // //------------------------------------ html request ------------------------------------
    // var userName = "dannyharris2";
    // var passWord = "oi6ZeQBvC95NuD1XvR8GJKzxtFZP6n";
    // function authenticateUser(user, password) {
    //     var token = user + ":" + password;
    //     // Should i be encoding this value????? does it matter???
    //     // Base64 Encoding -> btoa
    //     var hash = btoa(token);
    //     return "Basic " + hash;
    // }
    // function CallWebAPI() {
    //     // New XMLHTTPRequest
    //     var request = new XMLHttpRequest();
    //     request.open(
    //         "GET",
    //         "https://dry-eyrie-70197.herokuapp.com/https://rest.textmagic.com/api/v2/replies",
    //         false
    //     );
    //     request.setRequestHeader(
    //         "Authorization",
    //         authenticateUser(userName, passWord)
    //     );
    //     request.send();
    //     // view request status
    //     // alert(request.status);
    //     // response.innerHTML = request.responseText;
    //     let testVar = request.responseText;
    //     testVar = JSON.parse(testVar);
    //     console.log(testVar.resources);
    // }
    // CallWebAPI();
    // //------------------------------------ html request ------------------------------------
    // Read emails using Nylas--------------------------------------------------------------------------------
    // const Nylas = require("nylas");
    // Nylas.config({
    //     clientId: CLIENT_ID,
    //     clientSecret: CLIENT_SECRET,
    // });
    // const nylas = Nylas.with(ACCESS_TOKEN);
    // // List the 5 most recent unread email threads and print their subject lines
    // nylas.threads.list({ unread: true, limit: 5 }).then((threads) => {
    //     for (let thread of threads) {
    //         console.log(thread.subject);
    //     }
    // });
    // //Get the most recent message
    // nylas.messages.first({ in: "inbox" }).then((message) => {
    //     console.log(
    //         `Subject: ${message.subject} | ID: ${message.id} | Unread: ${message.unread}`
    //     );
    // });
}
