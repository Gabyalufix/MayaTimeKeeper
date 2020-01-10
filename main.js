


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


var addTaskLine = function(taskStat){
	var dd = document.createElement("div");
	dd.classList.add("taskStatLineDiv");
	var ddlab = document.createElement("div");
	ddlab.classList.add("taskStatLineNameEntry");
	ddlab.classList.add("logTaskEntryElement");
	ddlab.textContent = taskStat.taskName;
	var ddn = document.createElement("div");
	ddn.classList.add("logTaskEntryTime")
	ddn.classList.add("logTaskEntryElement");
	ddn.textContent = getElapsedTimeString(taskStat.elapsedTime);
	ddn.savedValue = ddn.textContent;
	var ddb = document.createElement("button");
	ddb.classList.add("logTaskEditButton");
	ddb.classList.add("logTaskEntryElement");
	ddb.textContent = "EDIT";
	var ddt = document.createElement("div");
	ddt.classList.add("logTaskEntryNotes");
	ddt.classList.add("logTaskEntryElement");
	ddt.textContent = "...";
	dd.appendChild(ddlab);
	dd.appendChild(ddn);
	dd.appendChild(ddb);
	dd.ddn = ddn;
	document.getElementById("INFOPANEL").appendChild(dd);
	dd.taskStat = taskStat;
	//ddn.onclick = function(){
		//error check, push result!
		/*vvs = this.textContent;
		vvstr = formatInputTime(vvs);
		if(vvstr == -1){
			console.log("ERROR: malformatted input time!");
			this.textContent = this.savedValue;
		} else {
			this.textContent = vvstr;
			this.savedValue = vvstr;
			this.parentElement.taskStat.elapsedTime = parseInputTime(vvstr);
		}*/
	//}
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
			lastDiv.getElementsByClassName("logTaskEntryTime")[0].textContent = getElapsedTimeString(lastDiv.taskStat.elapsedTime); 
		} else {
			addTaskLine(taskStat);
			taskStatLog.push(taskStat);
		}
	}
	saveCurrLog();
}

function writeTasksToTable( taskStatList ){
	
}
function readTasksFromTable( tableString) {
	
}

var makeTaskStat = function(taskButton){
	var out = { startTime : taskButton.startTime,
	         endTime: taskButton.endTime,
			 elapsedTime: taskButton.elapsedTime,
	         taskName: taskButton.taskName,
             notes: ""			 }
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
		document.getElementById("TASKTIMER").textContent = "00:00:00";
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

/*var settingsBG = document.getElementById('SETTINGS_WINDOW');
var settingsWindow = document.getElementById('SETTINGS_WINDOW_CONTENT');

document.getElementById("SETTINGS_BUTTON").onclick = function(){
    settingsBG.style.display="block"
    settingsWindow.style.display = "block"
    STATS["PAUSE"] = true;
    querySavegamesAndUpdate();
}

document.getElementById("SETTINGS_WINDOW_CLOSE").onclick = function(){
    settingsBG.style.display="none"
    settingsWindow.style.display = "none"
    STATS["PAUSE"] = false;

}*/

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

function getCurrentLogList(){
	var ddlist = document.getElementsByClassName("taskStatLineDiv");
	var saveTaskLog = []
	for( dd of ddlist ){
		saveTaskLog.push( dd.taskStat );
	}
	return saveTaskLog;
}

function saveCurrLog(){
	//taskStatLog
    var saveTaskLog = getCurrentLogList();
	var obj = { TASKLOG : saveTaskLog }
	localStorage.setItem("CURRTASKLOG.json",JSON.stringify(obj));
}

function loadCurrLog(){
	clearCurrLog();
	var taskLogList = JSON.parse(localStorage.getItem("CURRTASKLOG.json")).TASKLOG;
	for( ts of taskLogList ){
		addTaskLine(ts);
	}
}
function clearCurrLog(){
	var ddlist = document.getElementsByClassName("taskStatLineDiv");
	for( dd of ddlist ){
		dd.parentElement.removeChild( dd );
	}
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
function getTripleFromDate( d ){
	return [ d.getFullYear(), d.getMonth(), d.getDate() ] ;
}
function getStringFromTriple( d ){
	return d[0] + "."+(d[1]+"").padStart(2,"0") +"."+(d[2]+"").padStart(2,"0") ;
}
function getStringFromDate(d){
	return getStringFromTriple(getTripleFromDate(d));
}

function TICK_runFastTick(){
   if(taskIsActive && (! taskIsPaused)){
	   var t = currentTask.elapsedTime + ( (new Date()).getTime() - currentTask.mostRecentStart )
	   displayElapsed(t);
   }
   document.getElementById("CLOCK").textContent = formatAMPM(new Date());
}


function archiveTaskLog( taskStatList ){
	var currDate = (new Date());
	var currDateString = getStringFromDate(currDate);
	var currDateList = [currDate.year,currDate.monthIndex,currDate.day];
	var taskLogList = JSON.parse(localStorage.getItem("LOGARCHIVE.json"));
	taskLogList.push(currDateString);
	localStorage.setItem("LOGARCHIVE.json",JSON.stringify(taskLogList));
	localStorage.setItem("LOGARCHIVE."+currDateString+".json",JSON.stringify(taskStatList));
}
function archiveCurrentTaskLog(){
	archiveTaskLog( getCurrentLogList() );
}

function getArchive( fromDate, toDate ){
	archiveTaskLog( getCurrentLogList() );
	var s = new Date(fromDate[0],fromDate[1],fromDate[2]);
	var e = new Date(toDate[0],toDate[1],toDate[2]+1);
	var taskLogList = JSON.parse(localStorage.getItem("LOGARCHIVE.json"));
	var outList = [];
	for( ll of taskLogList ){
		var d = new Date( ll[0],ll[1],ll[2]);
		if( s < d && e > d ){
			var ds = getStringFromDate(d) ;
			var logpair = { ds : ds, log : JSON.parse(localStorage.getItem("LOGARCHIVE."+ds+".json")) };
			outList.push( logpair );
		}
	}
	return outList;
}


function downloadArchive( fromDate, toDate ){
	var aa = getArchive( fromDate, toDate );
	var out = "date\ttaskName\tstartTime\tendTime\telapsed\tnotes\n";
	var ss = getStringFromTriple( fromDate ) ;
	var es = getStringFromTriple( toDate ) ;

	for( a of aa) {
		var ds = a.ds;
		for( t of a.log){
			out = out + ""+ds+"\t"+t.taskName+"\t"+t.startTime+"\t"+t.endTime+"\t"+t.elapsedTime+"\t"+t.notes+"\n";
		}
	}
	download("MayaTimeLog."+ss+"-TO-"+es+".table.txt", out);
}
/*
	var out = { startTime : taskButton.startTime,
	         endTime: taskButton.endTime,
			 elapsedTime: taskButton.elapsedTime,
	         taskName: taskButton.taskName,
             notes: ""			 }
*/


if( localStorage.getItem("BUTTONSETUP.json") === null ){
	console.log("No task set found!");
} else {
	loadSavedTaskSet()
}
if( localStorage.getItem("CURRTASKLOG.json") === null ){
	console.log("No task set found!");
} else {
	loadCurrLog()
}
if( localStorage.getItem("LOGARCHIVE.json") === null ){
	localStorage.setItem("LOGARCHIVE.json",JSON.stringify([]));
}

function fullReset(){
	clearTaskLines();
	clearCurrLog();
	localStorage.removeItem("BUTTONSETUP.json");
	localStorage.removeItem("CURRTASKLOG.json");

}

window.setInterval(TICK_runFastTick,250);
