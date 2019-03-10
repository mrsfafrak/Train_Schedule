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
  var nextArrival;
  var minutesAway;
  // ensures the start time is in the past
  var trainStartTimePast = moment(trainStartTime, "hh:mm").subtract(1, "years");

  // difference in minutes between first train and now
  var diff = moment().diff(moment(trainStartTimePast), "minutes");
  // 
  var remainder = diff % trainFreq;
  // calculate minutes away
  minutesAway = trainFreq - remainder;
  // time of day for next arrival
  var nextTrain = moment().add(minutesAway, "minutes");
  nextArrival = moment(nextTrain).format("hh:mm");

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