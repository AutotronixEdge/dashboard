function testJS() {
    const Nylas = require("nylas");

    Nylas.config({
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
    });

    const nylas = Nylas.with(ACCESS_TOKEN);

    // List the 5 most recent unread email threads and print their subject lines
    nylas.threads.list({ unread: true, limit: 5 }).then((threads) => {
        for (let thread of threads) {
            console.log(thread.subject);
        }
    });

    //Get the most recent message
    nylas.messages.first({ in: "inbox" }).then((message) => {
        console.log(
            `Subject: ${message.subject} | ID: ${message.id} | Unread: ${message.unread}`
        );
    });
}
