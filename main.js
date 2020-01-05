


var addButtonButton = document.getElementById("ADDBUTTONBUTTON")
var taskPanel = document.getElementById("TASKPANEL")
var taskButtonNameBox = document.getElementById("taskButtonNameBox")

var getListOfTasks = function(){
	return taskPanel.getElementsByClassName("taskButton");
}



var taskIsActive = false;
var taskIsPaused = false;
var currentTask = null;

var taskStatLog = [];

var updateLogTask = function(taskEntry,newTime){
	""
}

//taskStat: taskStart,taskEnd,taskDuration,taskId

var deleteButtonActive = false;
var renameButtonActive = false;

var isInt = function(x){
	return (/^\d+$/).test(x) ;
}

var formatInputTime = function(xx){
	arr = xx.split(":");
	if( ! /^[0-9:]+$/.test(xx) ){
		return -1;
	}
    if(arr.length > 3){
		return -1;
	} else if( arr.length == 3){
		if( arr[0].length > 2 | isNaN(arr[0]) ){
			return -1
		}
		if( arr[1].length > 2 | isNaN(arr[1]) ){
			return -1
		}
		if( arr[2].length > 2 | isNaN(arr[2]) ){
			return -1
		}
		hh = parseInt(arr[0]);
		mm = parseInt(arr[1]);
		ss = parseInt(arr[2]);
		if( !( mm < 60 && ss < 60 )){
			return -1;
		}
		return (""+hh).padStart(2,"0") + ":"+(""+mm).padStart(2,"0")+":"+(""+ss).padStart(2,"0");
	} else if( arr.length == 2){
		hh = 0;
		if( arr[0].length > 2 | isNaN(arr[0]) ){
			return -1
		}
		mm = parseInt(arr[0]);
		if( arr[1].length > 2 | isNaN(arr[1]) ){
			return -1
		}
		ss = parseInt(arr[1]);
		if( !( mm < 60 && ss < 60 )){
			return -1;
		}
		return (""+hh).padStart(2,"0") + ":"+(""+mm).padStart(2,"0")+":"+(""+ss).padStart(2,"0");
	} else {
		if( ! isInt(xx)){
			return -1;
		}
		ssStr = xx.substring(xx.length - 2);
		mmStr = xx.substring(xx.length-4,xx.length-2)
		hhStr = xx.substring(xx.length-6,xx.length-4)
		ss = parseInt(ssStr);
		mm = isNaN(mmStr) || mmStr == "" ? 0 : parseInt(mmStr);
		hh = isNaN(hhStr) || hhStr == "" ? 0 : parseInt(hhStr);
		if( !( mm < 60 && ss < 60 )){
			return -1;
		}
		return (""+hh).padStart(2,"0") + ":"+(""+mm).padStart(2,"0")+":"+(""+ss).padStart(2,"0");
	}
}
var parseInputTime = function(ss){
	var arr = ss.split(":");
	return (parseInt(arr[0])*60*60 + parseInt(arr[1])*60 + parseInt(arr[0])) * 1000;
}

var addTaskLine = function(taskStat){
	var dd = document.createElement("div");
	dd.classList.add("taskStatLineDiv");
	var ddlab = document.createElement("div");
	ddlab.classList.add("taskStatLineNameEntry");
	ddlab.textContent = taskStat.taskName;
	var ddn = document.createElement("input");
	ddn.classList.add("logTaskEntryTime")
	ddn.value = getElapsedTimeString(taskStat.elapsedTime);
	ddn.savedValue = ddn.value;
	dd.appendChild(ddlab);
	dd.appendChild(ddn);
	document.getElementById("INFOPANEL").appendChild(dd);
	dd.taskStat = taskStat;
	ddn.onchange = function(){
		//error check, push result!
		vvs = this.value;
		vvstr = formatInputTime(vvs);
		if(vvstr == -1){
			console.log("ERROR: malformatted input time!");
			this.value = this.savedValue;
		} else {
			this.value = vvstr;
			this.savedValue = vvstr;
			this.parentElement.taskStat.elapsedTime = parseInputTime(vvstr);
		}
	}
}

var logTask = function(taskStat){
	console.log( "TASK: "+taskStat.taskName+": "+taskStat.elapsedTime);
	var statDivs = document.getElementById("INFOPANEL").getElementsByClassName("taskStatLineDiv");
	if(statDivs.length == 0){
			addTaskLine(taskStat);
			taskStatLog.push(taskStat);
	} else {
		var lastDiv = statDivs[statDivs.length-1];
		if(lastDiv.taskStat.taskName == taskStat.taskName){
			console.log("appending...");
			lastDiv.taskStat.elapsedTime = lastDiv.taskStat.elapsedTime + taskStat.elapsedTime;
			lastDiv.taskStat.endTime = taskStat.endTime;
			taskStatLog[taskStatLog.length - 1] = lastDiv.taskStat;
			lastDiv.getElementsByClassName("logTaskEntryTime")[0].value = getElapsedTimeString(lastDiv.taskStat.elapsedTime); 
		} else {
			addTaskLine(taskStat);
			taskStatLog.push(taskStat);
		}
	}
}

var makeTaskStat = function(taskButton){
	var out = { startTime : taskButton.startTime,
	         endTime: taskButton.endTime,
			 elapsedTime: taskButton.elapsedTime,
	         taskName: taskButton.taskName }
	return out;
}

function addTaskButton(taskName){
	var taskAlreadyAdded = false;
	var ttl = getListOfTasks();
	for(i = 0; i < ttl.length; i++) {
		if( ttl[i].taskName == taskName ){
			taskAlreadyAdded = true;
		}
	}
	
	if(taskAlreadyAdded ){
		console.log("Task already added!")
	} else {
	var bd = document.createElement("div");
	bd.classList.add("taskButtonHolder");
	
	var b = document.createElement("button");
	b.classList.add("taskButton");
	b.classList.add("inactiveTaskButton");
	b.taskName = taskName;
	b.textContent = b.taskName;
	b.isActiveTask = false;
	b.isPaused = false;
	b.elapsedTime = 0;
	b.startTime = 0;
	b.endTime = 0;
	b.mostRecentStart = 0;
	
	bd.appendChild(b);
	taskPanel.appendChild(bd);
	b.deactivateTask = function(){
		if(this.isActiveTask){
			this.classList.toggle("activeTaskButton");
			this.classList.toggle("inactiveTaskButton");
			this.isActiveTask = false;
			taskIsActive = false;
			currentTask = null;
			this.endTime = (new Date()).getTime();
			this.elapsedTime = this.elapsedTime + ( this.endTime - this.mostRecentStart )
			logTask(makeTaskStat(this));
			document.getElementById("ACTIVETASKLABEL").textContent = "[No Current Task]";

		}
	}
	b.activateTask = function(){
		this.classList.toggle("activeTaskButton");
		this.classList.toggle("inactiveTaskButton");
		this.isActiveTask = true;
		taskIsActive = true;
		this.isPaused = false;
		currentTask = this;
		this.startTime = (new Date()).getTime();
		this.mostRecentStart = this.startTime;
		this.elapsedTime = 0;
		document.getElementById("ACTIVETASKLABEL").textContent = "Current Task: "+this.taskName;
		document.getElementById("TASKTIMER").textContent = "00:00";
	}
	b.onclick = function(){
		if(deleteButtonActive){
			if(this.activeTask){
				this.deactivateTask();
			}
			this.parentElement.parentElement.removeChild(this.parentElement);
			this.classList.toggle("activeUtilButton");
			deleteButtonActive = false;
			document.getElementById("REMOVETASKBUTTON").classList.toggle("activeUtilButton")
			saveCurrentTaskSet()
		}
		if( this.isActiveTask ){
			this.deactivateTask();
		} else {
			for( t of getListOfTasks()){
				t.deactivateTask();
			}
			this.activateTask();
		}
	}
	}
}

addButtonButton.onclick = function(){
	//this.classList.add("")
	var taskName = taskButtonNameBox.value;	
	addTaskButton(taskName);
	saveCurrentTaskSet()
}



function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

function clearTaskLines(){
	var ttx = getListOfTasks();
	while(getListOfTasks().length > 0){
		getListOfTasks()[0].parentElement.parentElement.removeChild(getListOfTasks()[0].parentElement);
	}
	//for(tt of ttx){
	//	//console.log(tt);
	//	tt.parentElement.parentElement.removeChild(tt.parentElement);
	//}
}
function saveCurrentTaskSet(){
	var taskNameList = [];
	var buttonList = getListOfTasks()
	for( b of buttonList){
		taskNameList.push(b.taskName);
	}
	var obj = { TASKLIST : taskNameList };
	localStorage.setItem("BUTTONSETUP.json",JSON.stringify(obj));
}
function loadSavedTaskSet(){
	clearTaskLines();
	var taskNameList = JSON.parse(localStorage.getItem("BUTTONSETUP.json")).TASKLIST;
	for( tn of taskNameList){
		console.log("ADDING: "+tn);
		addTaskButton(tn);
	}
}

function saveTodaysLog(){
	//taskStatLog
}

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes ;
  return strTime.padStart(5,"0");
}

document.getElementById("REMOVETASKBUTTON").onclick = function(){
	this.classList.toggle("activeUtilButton");
   	if(deleteButtonActive){
		deleteButtonActive = false;
	} else {
		deleteButtonActive = true;
	}
}

function getElapsedTimeString(t){
	var s  = Math.floor( t / 1000 );
	var ss = s % 60;
	var mm = Math.floor(s / 60) % 60;
	var hh = Math.floor(s / 60 / 60);
	return (""+hh).padStart(2,"0") +":"+(""+mm).padStart(2,"0")+":"+ (""+ss).padStart(2,"0")
}

function displayElapsed(t){
	var estring = getElapsedTimeString(t);
	document.getElementById("TASKTIMER").textContent = estring;
}


function TICK_runFastTick(){
   if(taskIsActive && (! taskIsPaused)){
	   var t = currentTask.elapsedTime + ( (new Date()).getTime() - currentTask.mostRecentStart )
	   displayElapsed(t);
   }
   document.getElementById("CLOCK").textContent = formatAMPM(new Date());

}


window.setInterval(TICK_runFastTick,100);

if( localStorage.getItem("BUTTONSETUP.json") === null ){
	console.log("No task set found!");
} else {
	loadSavedTaskSet()
}

function fullReset(){
	clearTaskLines();
	localStorage.removeItem("BUTTONSETUP.json");
}

