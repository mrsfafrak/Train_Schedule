// Initialize Firebase
var config = {
  apiKey: "AIzaSyDK4U0I_C_MZnAF-v39evRkK_4Kgxbc8CI",
  authDomain: "train-schedule-hw-5978b.firebaseapp.com",
  databaseURL: "https://train-schedule-hw-5978b.firebaseio.com",
  projectId: "train-schedule-hw-5978b",
  storageBucket: "train-schedule-hw-5978b.appspot.com",
  messagingSenderId: "937875264981"
};
firebase.initializeApp(config);
var database = firebase.database();

$("#add-train-btn").on("click", function (event) {
  // prevent page from reloading
  event.preventDefault();

  // get values from add train form
  var trainName = $("#train-name-input").val().trim();
  var trainDest = $("#dest-input").val().trim();
  var trainStartTime = moment($("#start-time-input").val().trim(), "HH:mm").format("X");
  var trainFreq = $("#freq-input").val().trim();
  // console.log(trainName + trainDest + trainStartTime + trainFreq);

  // object of new train data
  var newTrain = {
    name: trainName,
    dest: trainDest,
    start: trainStartTime,
    freq: trainFreq
  };
  // push newTrain data to database
  database.ref().push(newTrain);
  // alert new train has been added
  $("#new-train").text("New train added successfully");

  // clear form of entry
  $("#train-name-input").val("");
  $("#dest-input").val("");
  $("#start-time-input").val("");
  $("#freq-input").val("");
});

// when a child is added to firebase, the following happens
database.ref().on("child_added", function (childSnapshot) {
  // console.log(childSnapshot.val());

  var trainName = childSnapshot.val().name;
  var trainDest = childSnapshot.val().dest;
  var trainStartTime = childSnapshot.val().start;
  var trainFreq = childSnapshot.val().freq;

        // var trainStartTimePretty = moment(trainStartTime, "X").format("HH:mm");

  // current time 
  var currentTime = moment().format("X");
        // var currentTimePretty = moment(currentTime, "X").format("HH:mm");
  console.log(currentTime);
        

  // difference in time between first train and current time
  var diff = currentTime - trainStartTime;
  console.log(diff);
  
  // number of trips that can be completed within diff window of time
  var trainTrip = diff % trainFreq;
  console.log(trainTrip);

  // trainTrip + 1 = next trip, multiply by train freq to get total time
  // add to train start time
  var nextArrival = ((trainTrip + 1) * trainFreq) + trainStartTime;
  // make it pretty to display
  var nextArrivalPretty = moment(nextArrival, "X").format("HH:mm a");
  console.log(nextArrivalPretty);


  var minAway = nextArrival - currentTime;
  var minAwayPretty = moment(minAway, "X").format("mm");
  console.log(minAwayPretty);


  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDest),
    $("<td>").text(trainFreq),
    $("<td>").text(nextArrivalPretty),
    $("<td>").text(minAwayPretty)
  );
  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});