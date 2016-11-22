
var activeChallengeID_ = -1;

var totalPolls = 10;
var timedTask = -1;
var indexPoll = 0;

var student;


$(function() {
// handle menu clicks and load pages
$('#navbar a').click(function() {
 //alert('clicked');
 var clicked = $(this).data("target");
 //alert(clicked);
 $("#pages .collapse").hide();  //first hide all of the elements
 if(student == null || student == '') {
   $('#msg').html('Please login');
   $('#msg').show();
 } else if((!$(clicked).attr('secure')) || (student != null && student != '')) {
   $(clicked).show();
 }

});

$('.navbar-collapse a').click(function(){
    $(".navbar-collapse").collapse('hide');
});

init();

//$('#main').show();

});



function poll() {

  //alert('test');

 // if(indexPoll == totalPolls) {
 //   return;
 // }
  //indexPoll++;
if(timedTask != -1) {
clearTimeout(timedTask);
}
  //listActiveStatistics();
getActiveChallengePre();
timedTask = setTimeout(function(){ poll(); }, 5000);

}

function togglePoll() {

 if(timedTask != -1) {
    clearTimeout(timedTask);
    timedTask = -1;
    $('#togglePollButton').toggleClass('btn-success btn-warning');
    $('#togglePollButton').html("Resume");
 } else {
    poll();
    $('#togglePollButton').toggleClass('btn-warning btn-success');
    $('#togglePollButton').html("Pause");

 }

}

function getRandomNumber(min, max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}




function submitAnswerPre(challengeID) {

//$('#spinner').show();

var formObj = $('#form_' + challengeID);
//alert('test: ' + challengeID);

//$("#form2 #name").val("Hello World!");
var valObj = $('#form_' + challengeID + ' #challengeID');

//alert(valObj.val());

// submit challenge ID to API so that it can be sent to Student's board


var checkedAnswers = $('input[name=answer]:checked').map(function() {
    return this.value;
}).get();

var answer = "{\"payload\": {\"student\": \"" + student + "\", \"challenge\": \"" + challengeID + "\", \"answer\": [";
for(var i=0; i < checkedAnswers.length; i++){
  answer += "\"" + checkedAnswers[i] + "\"";
   if(i < checkedAnswers.length - 1) {
    answer += ",";
   }
}
answer += "]}}";

//alert(answer);

submitAnswerAPI(answer);

}

function submitAnswerAPI(answer) {

jQuery.ajax(
{
url : apiURL_,
type: 'POST',
dataType : "json",
data: {"apiKey":apiKey_, "operation":"SubmitAnswer", "args":answer},
success:function(data) {
//alert("success: " + data.status.code);
submitAnswerPost(data);
},
error: function() {
alert("failed");
}
});
}

function submitAnswerPost(data) {
  if(data.status.code == '200') {
    $('#challenges').html('Your answer has submitted successfully. ');
  }
  //$('#spinner').hide();

}

// authroize pre action
function authorizePre(formObj) {


  if(formObj.auth_code.value != '') {
    //$('#spinner').show();
    authorizeAPI(formObj.auth_code.value);
  }
}

function authorizeAPI(authCode) {
  //alert('test api');
  jQuery.ajax(
  {
    url : apiURL_,
    type: 'POST',
    dataType : "json",
    data: {"apiKey":apiKey_, "operation": "Authorize", "args": authCode},
    success:function(data) {
      //alert('success' + data);
      authorizePost(data); // post call
    },
    error: function() {
      alert("failed" + data);
    }
  });
}

// authroize post
function authorizePost(data) {

   //$('#spinner').hide();
   //alert("success: " + data.status.code);
   if(data.status.code == '200') {

      student = data.payload.student;
      setCookie("user", student, 0);
      $('#non_auth').hide();
      $('#auth').show();
      $('#user').html(student);
      $('#msg').hide();
      $("#pages .collapse").hide();
      $('#challenge_list').show();

      // starting polling from server
      poll();

   } else {
      //$('#message').html(data.status.message);
      alert(data.status.message);
   }

}


function init() {

  // read user from cookie
  //alert('test');
  /**/
  //alert("Cookie: " + getCookie("user"));

 //$("#pages .collapse").hide();  //first hide all of the elements

  $('#msg').hide();

  student = getCookie("user");
  activeChallengeID_ = -1;
  clearTimeout(timedTask);
  timedTask = -1;

  if(student != null && student != '') {
    $('#non_auth').hide();
    $('#auth').show();
    $('#user').html(student);
  } else {
    $('#non_auth').show();
    $('#auth').hide();
  }
  /**/
}

function logout() {

  //alert('test');
  deleteCookie("user");
  student = '';

 $("#pages .collapse").hide();  //first hide all of the elements


   init();
}


function Challenge(question, type, answers) {
  this.question = question;
  this.type = type;
  this.answers = answers;
}

function Answer(label, text) {
  this.lable = lable;
  this.text = text;
}


// API calls
var apiURL_ = "https://script.google.com/macros/s/AKfycbzQAHqO1sUloffDyEDkj0ajZI0i0ndVUVG9zoR8LDIcyqUahloB/exec";
var apiKey_ = "1234567890";

function getActiveChallengePre() {
  //$('#spinner').show();
  getActiveChallengeAPI();
}

function getActiveChallengeAPI() {
jQuery.ajax(
{
url : apiURL_,
type: 'POST',
dataType : "json",
data: {"apiKey":apiKey_, "operation":"GetActiveChallenge"},
success:function(data) {
//alert("success: " + data.status.code);
getActiveChallengePost(data);
},
error: function() {
alert("failed");
}
});
}

function getActiveChallengePost(data) {


    //$('#spinner').hide();

   //var obj = JSON.parse(msg);
   var status = data.status;
   var payload = data.payload;
   // get status (header)
   var code = status.code;
   var message = status.message;
//alert('payload:' + payload.length);
  //for(var i=0; i < payload.length; i++) {
   if(payload == '') {
     $('#challenges').html('');
     return;
   }
   var obj = payload; //payload[i];

   // get payload
   var id = obj.id;
  // alert(id);
   if(id == activeChallengeID_) {
     // if the active challenge does not change, do nothing
     return;
   } else {
      // new challenge
      activeChallengeID_ = id; // remember it
   }

   var question = obj.question;
   var questionStatus = obj.status;
   var type = obj.type;
   var answers = obj.answers;
   // Construct challenge object
   var challenge = new Challenge(question, type, answers);

    $('#challenges').html('');
    $('#challenges').append("<div id='challenge_" + id + "'><span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span>  " + challenge.question + "<p>\
    <form id='form_" + id + "'>\
    <input type=hidden id='challengeID' name='challengeID' value='" + id + "'/>");
    for(var j=0; j < challenge.answers.length; j++) {
      var answer = challenge.answers[j];
      $('#challenges').append('<div>');
      if(challenge.type == 'm') {
        $('#challenges').append("<input name='answer' type=checkbox value='" + answer.label + "'/>");
      } else if(challenge.type == 's') {
        $('#challenges').append("<input name='answer' type=radio value='" + answer.label + "'/>");
      }
      $('#challenges').append(' ' + answer.label + '. ' + answer.text);
      $('#challenges').append('</div>');
    }
    $('#challenges').append("<p><br>" +
    "<button id='submitButton_" + id + "' class='btn btn-primary btn-sm' onClick=\"submitAnswerPre('" + id + "')\">" +
    "Submit <span class='glyphicon glyphicon-send'></span></button>");
    $('#challenges').append('</form></div><hr>');


}

