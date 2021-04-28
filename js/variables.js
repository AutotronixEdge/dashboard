// Variables
updateDelay = 500;
startAreaRadius = 6;
startThreshold = 2;

racerId = "default_racer";
accessCode = "";

wsUrl = "ws://18.237.79.7:3000/";
fbUrl = "https://autotronix-test-database-default-rtdb.firebaseio.com/";

inSession = false;
isUploaded = false;
isLoggedIn = false;
newDataReceived = false;
atLapStart = true;
isDataCompare = false;
startFirstLap = false;

garbageData = 0;

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
