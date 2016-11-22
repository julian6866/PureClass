

var totalPolls = 10;
var timedTask = -1;

var teacher = '';
// active challenge ID
var activeChallengeID_ = -1;


$(function() {
// handle menu clicks and load pages
$('#navbar a').click(function() {
 //alert('clicked');
 var clicked = $(this).data("target");
 //alert(clicked);
 $("#pages .collapse").hide();  //first hide all of the elements
 if(teacher == null || teacher == '') {
   $('#msg').html('Please login');
   $('#msg').show();
 } else if((!$(clicked).attr('secure')) || (teacher != null && teacher != '')) {
   $(clicked).show();
 }

});

$('.navbar-collapse a').click(function(){
    $(".navbar-collapse").collapse('hide');
});


 init();
 $('#main').show();

});


//var indexPoll = 0;


function poll() {

  //alert('test');

  //if(indexPoll == totalPolls) {
  //  return;
  //}
  //indexPoll++;
    if(timedTask != -1) {
        clearTimeout(timedTask);
    }
  //listActiveStatistics();
getActiveStatisticsAPI();

timedTask = setTimeout(function(){ poll(); }, 3000);

}

function togglePoll() {

 if(timedTask != -1) {
    clearTimeout(timedTask);
    timedTask = -1;
    $('#togglePollButton').toggleClass('btn-success btn-warning');
    $('#togglePollButton').html("<span class='glyphicon glyphicon-signal'></span> Statistics");
 } else {
    poll();
    $('#togglePollButton').toggleClass('btn-warning btn-success');
    $('#togglePollButton').html("<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span> Pause");

 }

}

function pausePoll() {
 clearTimeout(timedTask);
}


function getRandomNumber(min, max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

function listActiveStatistics(json) {

  var w = 300;
  var h = 300;
  var r = h/2;


  var color = d3.scale.category10();
  var data = json.payload;
  /**
  var data = [{"label":"A", "value":getRandomNumber(1,100)},
		    {"label":"B", "value":getRandomNumber(1,100)},
		    {"label":"C", "value":getRandomNumber(1,100)},
            {"label":"D", "value":getRandomNumber(1,100)}
           ];
    **/
$('#statistics').html("<div id='chart'></div>");
$('#statistics').append("<div id='data'></div>");

//$('#chart').html('');
//$('#data').html('');

var vis = d3.select('#chart')
   .append("svg:svg")
   //.append(svgContainer)
   .data([data])
   .attr("width", w)
   .attr("height", h)
    .style("background-color", "white")
   //.attr("width", w)
   //.attr("height", h)
   .append("svg:g")
   .attr("transform", "translate(" + r + "," + r + ")");

var pie = d3.layout.pie().value(function(d) { return d.value; });

// declare an arc generator function
var arc = d3.svg.arc().outerRadius(r);

// select paths, use arc generator to draw
var arcs = vis.selectAll("g.slice")
   .data(pie)
   .enter()
   .append("svg:g")
   .attr("class", "slice");

arcs.append("svg:path")
    .attr("fill", function(d, i){
        return color(i);
    })
    .attr("d", function (d) {
        // log the result of the arc generator to show how cool it is :)
        //console.log(arc(d));
        return arc(d);
    });

// add the text
// add the text
arcs.append("svg:text").attr("transform", function(d){
			d.innerRadius = 0;
			d.outerRadius = r;
    return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
    return data[i].label;}
		);

arcs.append("svg:text")
   .attr("x", function(d, i) { return 180; })
   .attr("y", function(d, i) { return i*30 - 90; })
  .text(function(d, i) {
  return data[i].label;});

}

function listChallenges(data) {


   //var obj = JSON.parse(msg);
   var status = data.status;
   var payload = data.payload;
   // get status (header)
   var code = status.code;
   var message = status.message;

    var activeChallenge = payload.active;

    if(activeChallenge) {
        activeChallengeID_ = activeChallenge.id;
    } else {
      activeChallengeID_ = '';
    }
    var allChallenges = payload.all;

var btn = $('#boardButton');
btn.html("<span class='glyphicon glyphicon-unchecked'></span> Question Board: " + activeChallengeID_);
btn.toggleClass('btn-warning btn-default');

  $('#challenges').html('');

//alert('payload:' + payload.length);

  for(var i=0; i < allChallenges.length; i++) {

   var obj = allChallenges[i];

   // get challenge
   var id = obj.id;
   var question = obj.question;
   var type = obj.type;
   var answers = obj.answers;
   // Construct challenge object
   var challenge = new Challenge(question, type, answers);

    $('#challenges').append("<div id='challenge_" + id + "'>" + id + ". " + challenge.question + "<p>\
    <form id='form_" + id + "'>\
    <input type=hidden id='challengeID' name='challengeID' value='" + id + "'/>");
    for(var j=0; j < challenge.answers.length; j++) {
      var answer = challenge.answers[j];
      $('#challenges').append('<div>');
      if(challenge.type == 'm') {
        $('#challenges').append("<input name='answer_" + id + "' type=checkbox value='" + answer.label + "'/>");
      } else if(challenge.type == 's') {
        $('#challenges').append("<input name='answer_" + id + "' type=radio value='" + answer.label + "'/>");
      }
      $('#challenges').append(' ' + answer.label + ': ' + answer.text);
      $('#challenges').append('</div>');
    }
    $('#challenges').append("<p><br>" +
    "<button id='submitButton_" + id + "' class='btn btn-primary btn-sm' onClick=\"sendChallengePre('" + id + "')\">" +
    "Send to Question Board <span class='glyphicon glyphicon-send'></span></button>");
    $('#challenges').append('</form></div><hr>');
   }

}

function listStatistics() {

  var w = 200;
  var h = 200;
  var r = h/2;


  var color = d3.scale.category10();
  var data = [{"label":"A", "value":getRandomNumber(1,100)},
		    {"label":"B", "value":getRandomNumber(1,100)},
		    {"label":"C", "value":getRandomNumber(1,100)},
            {"label":"D", "value":getRandomNumber(1,100)}
           ];

$('#statistics').append("<div id='chart'></div>");
$('#statistics').append("<div id='data'></div>");

//$('#chart').html('');
//$('#data').html('');

var vis = d3.select('#chart')
   .append("svg:svg")
   //.append(svgContainer)
   .data([data])
   .attr("width",400)
   .attr("height",400)
    .style("background-color", "white")
   //.attr("width", w)
   //.attr("height", h)
   .append("svg:g")
   .attr("transform", "translate(" + r + "," + r + ")");

var pie = d3.layout.pie().value(function(d) { return d.value; });

// declare an arc generator function
var arc = d3.svg.arc().outerRadius(r);

// select paths, use arc generator to draw
var arcs = vis.selectAll("g.slice")
   .data(pie)
   .enter()
   .append("svg:g")
   .attr("class", "slice");

arcs.append("svg:path")
    .attr("fill", function(d, i){
        return color(i);
    })
    .attr("d", function (d) {
        // log the result of the arc generator to show how cool it is :)
        //console.log(arc(d));
        return arc(d);
    });

// add the text
// add the text
arcs.append("svg:text").attr("transform", function(d){
			d.innerRadius = 0;
			d.outerRadius = r;
    return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
    return data[i].label;}
		);

arcs.append("svg:text")
   .attr("x", function(d, i) { return 120; })
   .attr("y", function(d, i) { return i*20 - 60; })
  .text(function(d, i) {
  return data[i].label;});

}

function sendChallengePre(challengeID) {

var formObj = $('#form_' + challengeID);
//alert('test: ' + challengeID);

//$("#form2 #name").val("Hello World!");
var valObj = $('#form_' + challengeID + ' #challengeID');

//alert(valObj.val());

// submit challenge ID to API so that it can be sent to Student's board

sendChallengeAPI(challengeID);

}


function sendChallengeAPI(challengeID) {
jQuery.ajax(
{
url : apiURL_,
type: 'POST',
dataType : "json",
data: {"apiKey":apiKey_, "operation":"SendChallenge", "args":challengeID},
success:function(data) {
//alert("success: " + data.status.code);
sendChallengePost(challengeID);

},
error: function() {
alert("failed");
}
});
}

function sendChallengePost(challengeID) {

activeChallengeID_ = challengeID;
//alert('success');
//var valObj = $('#challenge_' + challengeID + ' #form_' + challengeID +  ' #submit');
//alert(valObj);
//var valObj = $('#form_' + challengeID + ' #submitButton_' + challengeID);
var btn = $('#submitButton_' + challengeID);
//alert(valObj.val());
//valObj.val('test');
//alert(valObj.attr("value"));
//valObj.prop('value', 'Clear from Student Board');
btn.html("<span class='glyphicon glyphicon-ok'></span> Sent");
btn.toggleClass('btn-primary btn-success');

var btn2 = $('#boardButton');
btn2.html("<span class='glyphicon glyphicon-unchecked'></span> Question Board: " + activeChallengeID_);
btn2.toggleClass('btn-warning btn-default');
//valObj.val('my button');
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



function getChallengeID() {
jQuery.ajax(
{
url : apiURL_,
type: 'POST',
dataType : "json",
data: {"apiKey":apiKey_, "operation": "GetChallengeID"},
success:function(data) {
alert("success: " + data.status.code);
},
error: function() {
alert("failed" + data);
}
});
}

function getChallenge(challengeID) {
jQuery.ajax(
{
url : apiURL_,
type: 'POST',
dataType : "json",
data: {"apiKey":apiKey_, "operation":"GetChallenge", "args":challengeID},
success:function(data) {
//alert("success: " + data.status.code);
getChallengeSample(data);
},
error: function() {
alert("failed");
}
});
}

function getChallengesForStudent() {
jQuery.ajax(
{
url : apiURL_,
type: 'POST',
dataType : "json",
data: {"apiKey":apiKey_, "operation":"GetChallengesForStudent"},
success:function(data) {
//alert("success: " + data.status.code);
listChallenges(data);
},
error: function() {
alert("failed");
}
});
}

function getActiveStatisticsAPI() {
jQuery.ajax(
{
url : apiURL_,
type: 'POST',
dataType : "json",
data: {"apiKey":apiKey_, "operation":"GetActiveStatisticsForTeacher"},
success:function(data) {
//alert("success: " + data.payload);
listActiveStatistics(data);
},
error: function() {
alert("failed");
}
});
}

function getChallengesForTeacher() {

jQuery.ajax(
{
url : apiURL_,
type: 'POST',
dataType : "json",
data: {"apiKey":apiKey_, "operation":"GetChallengesForTeacher"},
success:function(data) {
//alert("success: " + data.status.code);
listChallenges(data);
},
error: function() {
alert("failed");
}
});
}

// set active ChallengeID
function setChallengeID(challengeID) {
 if(activeChallengeID_ == challengeID) {
   // do nothing
 } else {
   activeChallengeID_ = challengeID;
   getChallenge(activeChallengeID_); // call API to get challenge.
 }
}



function clearActiveChallengePre() {
clearActiveChallengeAPI();
}

function clearActiveChallengeAPI() {
jQuery.ajax(
{
url : apiURL_,
type: 'POST',
dataType : "json",
data: {"apiKey":apiKey_, "operation":"ClearActiveChallenge"},
success:function(data) {
alert("success: " + data.status.code);
clearActiveChallengePost(data.status.code);

},
error: function() {
alert("failed");
}
});
}

function clearActiveChallengePost(data) {
//alert(data);
var btn = $('#boardButton');
btn.html("<span class='glyphicon glyphicon-unchecked'></span> Question Board: Empty");
btn.toggleClass('btn-warning btn-default');
}

function getStudentsPre() {
 //alert('test');
 getStudentsAPI();
}

function getStudentsAPI() {
jQuery.ajax(
{
url : apiURL_,
type: 'POST',
dataType : "json",
data: {"apiKey":apiKey_, "operation":"GetStudents"},
success:function(data) {
//alert("success: " + data.status.code);
getStudentsPost(data);

},
error: function() {
alert("failed");
}
});
}
function getStudentsPost(data) {

//alert(data.status.code);
   //var obj = JSON.parse(msg);
   var status = data.status;
   var payload = data.payload;
   // get status (header)
   var code = status.code;
   var message = status.message;

  $('#students').html('');

//alert('payload:' + payload.length);

  for(var i=0; i < payload.length; i++) {

   var obj = payload[i];

   // get payload
   var student = obj.student;
   var login = obj.login;
   var answers = obj.answers;
   // Construct challenge object

    $('#students').append("<div>");
    $('#students').append("<span class='glyphicon glyphicon-user'></span> ");
    $('#students').append(student);
    $('#students').append('</div><hr>');
   }

}


// authroize pre action
function authorizePre(formObj) {

  if(formObj.auth_code.value != '') {
    //authorizeAPI(formObj.auth_code.value);
    // for POC
    teacher = formObj.auth_code.value;
    var data = {
      "status": {
        "code": "200",
        "message": "success"
      },
      "payload": {
        "teacher": teacher
      }
    };
    authorizePost(data);
    // end POC
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
   //alert("success: " + data.status.code);
   if(data.status.code == '200') {

      teacher = data.payload.teacher;
      setCookie("user", teacher, 0);
      $('#non_auth').hide();
      $('#auth').show();
      $('#user').html(teacher);
      $('#msg').hide();
      $("#pages .collapse").hide();
      //$('#challenge_list').show();

   } else {
      //$('#message').html(data.status.message);
      alert(data.status.message);
   }
   // call back
}

function logout() {

  //alert('test');
  deleteCookie("user");
  teacher = '';
  //activeChallengeID_ = -1;

  init();
}

function init() {

  // read user from cookie
  //alert('test');
  /**/
  //alert("Cookie: " + getCookie("user"));
  $('#msg').hide();

 $("#pages .collapse").hide();  //first hide all of the elements

  teacher = getCookie("user");
  clearTimeout(timedTask);
  timedTask = -1;

  if(teacher != null && teacher != '') {
    $('#non_auth').hide();
    $('#auth').show();
    $('#user').html(teacher);
  } else {
    $('#non_auth').show();
    $('#auth').hide();
  }
  /**/
}