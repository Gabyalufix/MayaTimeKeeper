
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