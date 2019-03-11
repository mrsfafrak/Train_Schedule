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
  // var trainStartTime = moment($("#start-time-input").val().trim(), "HH:mm").format("X");
  var trainStartTime = $("#start-time-input").val().trim();
  var trainFreq = $("#freq-input").val().trim();

  // if any field is blank, user needs to try again
  if (trainName === "" || trainDest === "" || trainStartTime === "" || trainFreq === "") {
    $("#new-train").text("You missed one or more fields. Try again.");
    // clear form of entry
    $("#train-name-input").val("");
    $("#dest-input").val("");
    $("#start-time-input").val("");
    $("#freq-input").val("");
  }
  // if all fields have data
  else {
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
    $("#new-train").text("New train added successfully!");

    // clear form of entry
    $("#train-name-input").val("");
    $("#dest-input").val("");
    $("#start-time-input").val("");
    $("#freq-input").val("");
  };
});

// when a child is added to firebase, the following happens
database.ref().on("child_added", function (childSnapshot) {
  // console.log(childSnapshot.val());
  var trainName = childSnapshot.val().name;
  var trainDest = childSnapshot.val().dest;
  var trainStartTime = childSnapshot.val().start;
  var trainFreq = childSnapshot.val().freq;
  // variables needed to be calucated to add to train table row
  var nextArrival;
  var minutesAway;
  // ensures the start time is in the past (subtracted a day off of time bc moment.js works with date and time)
  var trainStartTimePast = moment(trainStartTime, "hh:mm").subtract(1, "days");
  // difference in minutes between first train and now using difference in moment.js
  var diff = moment().diff(moment(trainStartTimePast), "minutes");
  // remainder left when you take into account the diff and train frequency
  var remainder = diff % trainFreq;
  // calculate minutes away for next train using the remainder left
  minutesAway = trainFreq - remainder;
  // time of day for next arrival
  var nextTrain = moment().add(minutesAway, "minutes");
  // change format of next arrival time of day using moment.js
  nextArrival = moment(nextTrain).format("hh:mm a");

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDest),
    $("<td>").text(trainFreq),
    $("<td>").text(nextArrival),
    $("<td>").text(minutesAway)
  );
  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});