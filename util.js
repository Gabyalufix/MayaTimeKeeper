

function getRandomBetween(a,b){
  var span = b-a;
  return (Math.random() * span) + a;
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PROCEDURAL TEXT PARSING
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function generateProceduralTextPrintFail(err, ss, SSVAR,soFar){
  console.log("ERROR: generateProceduralText."+err+": [ss=\""+ss+"\",soFar = \""+soFar+"\"]");
}

//generateProceduralText(STATICVAR_HOLDER.PROCTEXT.STAR_NAME,{},"",true)
//generateProceduralText(STATICVAR_HOLDER.PROCTEXT.SCRAMBLE_SYLLABLE_WORD,{},"",true)
//genProcText(STATICVAR_HOLDER.PROCTEXT.STAR_NAME)
function genProcText(ss){
  return generateProceduralText(ss,{},verbose=false);
}

function generateProceduralText(ss, SSVAR, verbose){
  return generateProceduralTextMain(ss,SSVAR,soFar="",verbose=verbose, 1)
}


function generateProceduralTextMain(ssin, SSVAR = {}, soFar = "", verbose = true, lvl = 1){
   var ss = ssin.slice()
   if(ss.length == 0 && verbose){
     console.log("|  ".repeat(lvl)+"Starting on: []; sofar=\""+soFar+"\" (Lvl="+lvl+")");
   } else if(verbose) {
     console.log("|  ".repeat(lvl)+"Starting on: [["+ss[0] + "],...]; sofar=\""+soFar+"\" (Lvl="+lvl+")");
   }

   if(ss.length == 0){
     if(verbose){ console.log("|  ".repeat(lvl)+"LEN=0: returning("+soFar+")") }
     return soFar;
   } else if(! (ss[0] instanceof Array)){
     if(verbose){ console.log("|  ".repeat(lvl)+"NON ARRAY") }
     return generateProceduralTextMain(ss, SSVAR, soFar + ss.shift(),verbose,lvl)
   } else if(ss[0][0] == "#RANDOR"){
     if(verbose){ console.log("|  ".repeat(lvl)+"#RANDOR") }
     var randArray = ss.shift().slice(1);
     var randThresh = parseFloat(randArray.shift());
     if(randThresh > Math.random()){
       if(verbose){ console.log("|  ".repeat(lvl)+"###"+ "#RANDOR[0] START ["+randArray[0]+"]") }
       var ror = generateProceduralTextMain([randArray[0]],SSVAR,"",verbose, lvl + 1)
       if(verbose){ console.log("|  ".repeat(lvl)+"###"+ "#RANDOR[0] END (\""+ror+"\")") }
       return generateProceduralTextMain(ss, SSVAR, soFar = soFar + ror ,verbose,lvl)
     } else {
       if(verbose){ console.log("|  ".repeat(lvl)+"###"+ "#RANDOR[1] START: ["+randArray[1]+"]") }
       var ror = generateProceduralTextMain([randArray[1]],SSVAR,"",verbose, lvl + 1)
       if(verbose){ console.log("|  ".repeat(lvl)+"###"+ "#RANDOR[1] END (\""+ror+"\")") }
       return generateProceduralTextMain(ss, SSVAR, soFar = soFar + ror,verbose,lvl)
     }
   } else if(ss[0][0] == "#RAND"){
     if(verbose){ console.log("|  ".repeat(lvl)+"#RAND") }
     var randArray = ss.shift().slice(1);
     if(verbose){ console.log("|  ".repeat(lvl)+"###"+ "#RAND START") }
     var randPhrase = generateProceduralTextMain([ randArray[randLT(randArray.length)] ], SSVAR,"",verbose, lvl + 1)
     if(verbose){ console.log("|  ".repeat(lvl)+"###"+ "#RAND END (\""+randPhrase+"\")") }
     return generateProceduralTextMain(ss, SSVAR, soFar + randPhrase,verbose,lvl)
   } else if(ss[0][0] == "#V.SET"){
     if(verbose){ console.log("|  ".repeat(lvl)+"#V.SET") }
     var sva = ss.shift().slice();
     if(sva.length < 3){
       generateProceduralTextPrintFail("#V.SET: sva.length < 3",ss,SSVAR,soFar)
     }
     var setvar = sva.shift();
     var varid = sva.shift();
     if(verbose){ console.log("|  ".repeat(lvl)+"###"+ "#START VSET:") }
     var varvalue = generateProceduralTextMain([sva],SSVAR,"",verbose, lvl + 1);
     if(verbose){ console.log("|  ".repeat(lvl)+"###"+ "#END VSET:") }
     SSVAR[varid] = varvalue;
     return generateProceduralTextMain(ss, SSVAR, soFar + varvalue,verbose,lvl);
   } else if(ss[0][0] == "#V.SET.QUIET"){
     if(verbose){ console.log("|  ".repeat(lvl)+"#V.SET.QUIET") }
     var sva = ss.shift().slice()
     if(sva.length < 3){
       generateProceduralTextPrintFail("#V.SET.QUIET: sva.length < 3",ss,SSVAR,soFar)
     }
     var setvar = sva.shift();
     var varid = sva.shift();
     if(verbose){ console.log("|  ".repeat(lvl)+"###"+ "#START VSET:") }
     var varvalue = generateProceduralTextMain([sva],SSVAR,"",verbose, lvl + 1);
     if(verbose){ console.log("|  ".repeat(lvl)+"###"+ "#END VSET:") }
     SSVAR[varid] = varvalue;
     return generateProceduralTextMain(ss, SSVAR, soFar,verbose,lvl);
   } else if(ss[0][0] == "#GLOBAL.GET"){
     if(verbose){ console.log("|  ".repeat(lvl)+"#GLOBAL.GET ("+ss[0][1]+")") }
     var sva = ss.shift().slice();
     if(sva.length  != 2){
        generateProceduralTextPrintFail("#GLOBAL.GET: sva.length != 2",ss,SSVAR,soFar)
     }
     var varid = sva[1]
     if(verbose){ console.log("|  ".repeat(lvl)+"###"+ "#GLOBAL.GET START ["+varid+"]"+PROCTEXT[varid]) }
     var varvalue = generateProceduralTextMain(PROCTEXT[varid],SSVAR,"",verbose, lvl + 1)
     if(verbose){ console.log("|  ".repeat(lvl)+"###"+ "#GLOBAL.GET END (\""+varvalue+"\")") }
     return generateProceduralTextMain(ss, SSVAR, soFar + varvalue,verbose,lvl);
   } else if(ss[0][0] == "#V.GET"){
     if(verbose){ console.log("|  ".repeat(lvl)+"#V.GET") }
     var sva = ss.shift().slice();
     if(sva.length  != 2){
        generateProceduralTextPrintFail("#V.GET: sva.length != 2",ss,SSVAR,soFar)
     }
     var varid = sva[1]
     var varvalue = SSVAR[varid]
     if(varvalue == null){
       generateProceduralTextPrintFail("#V.GET: varid \""+varid+"\" not found!",ss,SSVAR,soFar)
     }
     return generateProceduralTextMain(ss, SSVAR, soFar + varvalue,verbose,lvl);
   } else if(ss[0][0] == "#V.SWITCH"){
     if(verbose){ console.log("|  ".repeat(lvl)+"#V.SWITCH") }
     var sva = ss.shift().slice()
     if(sva.length < 3){
        generateProceduralTextPrintFail("#V.SWITCH: sva.length <3",ss,SSVAR,soFar)
     }
     var cmd = sva.shift()
     var varid = sva.shift()
     var varlookup = SSVAR[varid]
     if(varlookup == null){
       generateProceduralTextPrintFail("|  ".repeat(lvl)+"#V.SWITCH: varid \""+varid+"\" not found!",ss,SSVAR,soFar)
     }

     if((! (sva[0] instanceof Array)) || sva[0].length != 2 || (! (sva[0][0] instanceof Array)) || sva[0][0][0] != "DEFAULT"){
       generateProceduralTextPrintFail("#V.SWITCH: Malformed first/default element",ss,SSVAR,soFar)
     }
     if(verbose){ console.log("|  ".repeat(lvl)+"###"+ "#START SWITCH-DEFAULT:") }
     var varvalue = generateProceduralTextMain([sva.shift()[1]],SSVAR,"",verbose, lvl + 1);
     if(verbose){ console.log("|  ".repeat(lvl)+"###"+ "#END SWITCH-DEFAULT:") }
     for(var ii = 0; ii < sva.length; ii++){
       if((! (sva[i] instanceof Array)) || sva[ii].length != 2 || (! (sva[ii][0] instanceof Array))){
         generateProceduralTextPrintFail("#V.SWITCH: Malformed "+ii+"th element",ss,SSVAR,soFar)
       }
       for(var jj=0; jj < sva[i][0].length; jj++){
         if(varlookup == sva[ii][0][jj]){
           if(verbose){ console.log("|  ".repeat(lvl)+"###"+ "#START SWITCH:") }
           varvalue = generateProceduralTextMain( [varvalue[ii][1]], SSVAR, "",verbose, lvl+1 )
           if(verbose){ console.log("|  ".repeat(lvl)+"###"+ "#END SWITCH:") }
         }
       }
     }
     return generateProceduralTextMain( ss, SSVAR, soFar + varvalue,verbose,lvl)
   } else {
     if(verbose){ console.log("|  ".repeat(lvl)+"#V.DEFAULT") }
     var sva = ss.shift().slice();
     if(! (sva instanceof Array)){
        console.log("error?")
     }
     /*console.log(typeof sva)*/
     var sss = sva.concat(ss)
     return generateProceduralTextMain(sss, SSVAR, soFar,verbose,lvl)
   }



}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// HTML FORMATTING
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var THEME_PROPERTIES = ["--white","--LT4","--LT3","--LT2","--LT1","--MID","--DK1","--DK2","--DK3","--DK4","--baseBG","--black"]
function setElementTheme(tt,theme){
  var themeProps = getComputedStyle(theme);
  for(var iii=0;iii<THEME_PROPERTIES.length;iii++){
    var pp = THEME_PROPERTIES[iii]
    tt.style.setProperty(pp,themeProps.getPropertyValue(pp))
  }
  tt.THEME = theme.themeID;
}
function unsetElementTheme(tt){
  for(var iii=0;iii<THEME_PROPERTIES.length;iii++){
    var pp = THEME_PROPERTIES[iii]
    tt.style.setProperty(pp,null)
  }
  tt.THEME = "";
}



THEMES_FOR_SUBTLE=["Green","Bot","Psy"]
THEME_PROPERTIES_TO_TRANSPARENT=["--LT4", "--LT3", "--LT2", "--LT1"]
THEME_PROPERTIES_TO_DESAT=["--DK4", "--DK3", "--DK2", "--DK1"]

for(var i=0; i < THEMES_FOR_SUBTLE.length; i++){
  var sid = THEMES_FOR_SUBTLE[i];
  var ss = document.querySelectorAll(".THEME_SUBTLE_"+sid);
  console.log("Making theme subtle: "+sid);
  for(var j=0; j<ss.length; j++){
     var ssj = ss[j];
     console.log("making object subtle: "+ssj)
     var ssSty = getComputedStyle(ssj);
     //console.log("    bgcol: "+ssSty.getPropertyValue("background-color") );

     //var bgcol = tinycolor( ssSty.getPropertyValue("background-color"))
     //console.log("    bg: "+bgcol.toHex8String() );
     //bgcol.setAlpha(0.2)
     //console.log("    bg: "+bgcol.toHex8String() );

     //ssj.style.setProperty("background-color",bgcol.toHex8String());
     for(var k=0; k < THEME_PROPERTIES_TO_TRANSPARENT.length; k++){
         var pid = THEME_PROPERTIES_TO_TRANSPARENT[k];
         //console.log("    ["+pid+"]: "+ssSty.getPropertyValue(pid)+" > "+tinycolor( ssSty.getPropertyValue(pid) ).setAlpha(0.1).toHex8String() );
         ssj.style.setProperty(pid, tinycolor( ssSty.getPropertyValue(pid) ).setAlpha(0.2).desaturate(15).toHex8String() )   
     }
     /*
     for(var k=0; k < THEME_PROPERTIES.length; k++){
         var pid = THEME_PROPERTIES[k];
         ssj.style.setProperty(pid, tinycolor( ssSty.getPropertyValue(pid) ).desaturate(10).toHexString )   
     }*/
  }
  var ss = document.querySelectorAll(".THEME_DESAT_"+sid);
  console.log("Making theme desat: "+sid);
  for(var j=0; j<ss.length; j++){
     var ssj = ss[j];
     console.log("making object desat: "+ssj)
     var ssSty = getComputedStyle(ssj);
     //console.log("    bgcol: "+ssSty.getPropertyValue("background-color") );

     //var bgcol = tinycolor( ssSty.getPropertyValue("background-color"))
     //console.log("    bg: "+bgcol.toHex8String() );
     //bgcol.setAlpha(0.2)
     //console.log("    bg: "+bgcol.toHex8String() );

     //ssj.style.setProperty("background-color",bgcol.toHex8String());
     for(var k=0; k < THEME_PROPERTIES.length; k++){
         var pid = THEME_PROPERTIES[k];
         ssj.style.setProperty(pid, tinycolor( ssSty.getPropertyValue(pid) ).desaturate(10).toHex8String() )   
     }
     /*
     for(var k=0; k < THEME_PROPERTIES.length; k++){
         var pid = THEME_PROPERTIES[k];
         ssj.style.setProperty(pid, tinycolor( ssSty.getPropertyValue(pid) ).desaturate(10).toHexString )   
     }*/
  }
/*
  for(var j=0; j < THEME_PROPERTIES.length; j++){
    var pid = THEME_PROPERTIES[j];
    themeProps.style.setProperty(pid, tinycolor( themeProps.getPropertyValue(pid) ).desaturate(10).toHexString )
  }*/
}

//
//Subtle themes:
/*THEMES_FOR_SUBTLE=["Green","Bot","Psy"]

for(var i=0; i < THEMES_FOR_SUBTLE.length; i++){
  var sid = THEMES_FOR_SUBTLE[i];
  var stheme = document.getElementById("THEME_SUBTLE_"+sid);

  var themeProps = getComputedStyle(stheme);

  for(var j=0; j < THEME_PROPERTIES.length; j++){
    var pid = THEME_PROPERTIES[j];
    themeProps.style.setProperty(pid, tinycolor( themeProps.getPropertyValue(pid) ).desaturate(10).toHexString )
  }
}

var ss = document.querySelectorAll('.THEME_SUBTLE_Green');
for(var i=0; i<ss.length; i++){

i=0;

  var ssi = ss[i];
  var compStyle = getComputedStyle(ssi);
  for(var j=0; j < THEME_PROPERTIES.length; j++){
    var pid = THEME_PROPERTIES[j];
    ssi.style.setProperty(pid,tinycolor(compStyle.getPropertyValue(pid)).desaturate(20).toHexString());
  }


}

var ss = document.querySelectorAll('.THEME_SUBTLE_Green');

i=0;

  var ssi = ss[i];
  var compStyle = getComputedStyle(ssi);
  for(var j=0; j < THEME_PROPERTIES.length; j++){
    var pid = THEME_PROPERTIES[j];
    ssi.style.setProperty(pid,tinycolor(compStyle.getPropertyValue(pid)).desaturate(20).toHexString());
  }


*/



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MATH
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function roundTo(value, decimals) {
  var nn = Number(Math.round(value+'e'+decimals)+'e-'+decimals)
  if(isNaN(nn)){
      if(value < 1 && value >= 0){
        return Number("0").toFixed(decimals);
      } else if(value > -1 && value <= 0){
        return Number("0").toFixed(decimals); 
      } else {
        return "?"+value+"?"
      }
  } else {
      return nn.toFixed(decimals);;
  }
}


function supText(srcText){
  var out = '';
  var chArray = srcText.split('');
  var supHash = {
    'a': '\u1D43', 'A':'\u1D2C',
    'b': '\u1D47', 'B':'\u1D2D',
    'c': '\u1D9C', 'C':'?',
    'd': '\u1D48', 'D':'\u1D30',
    'e': '\u1D49', 'E':'\u1D31',
    'f': '\u1DA0', 'F':'?',
    'g': '\u1D4D', 'G':'\u1D33',
    'h': '\u02B0', 'H':'\u1D34',
    'i': '\u2071', 'I':'\u1D35',
    'j': '\u02B2', 'J':'\u1D36',
    'k': '\u1D4F', 'K':'\u1D37',
    'l': '\u02E1', 'L':'\u1D38',
    'm': '\u1D50', 'M':'\u1D39',
    'n': '\u207F', 'N':'\u1D3A',
    'o': '\u1D52', 'O':'\u1D3C',
    'p': '\u1D56', 'P':'\u1D3E',
    'q': '?',      'Q':'?',
    'r': '\u02B3', 'R':'\u1D3F',
    's': '\u02E2', 'S':'?',
    't': '\u1D57', 'T':'\u1D40',
    'u': '\u1D58', 'U':'\u1D41',
    'v': '\u1D5B', 'V':'\u2C7D',
    'w': '\u02B7', 'W':'\u1D42',
    'x': '\u02E3', 'Y':'?',
    'y': '\u02B8', 'X':'?',
    'z': '\u1DBB', 'Z':'?',
    '0': '\u2070',
    '1': '\u00B9',
    '2': '\u00B2',
    '3': '\u00B3',
    '4': '\u2074',
    '5': '\u2075',
    '6': '\u2076',
    '7': '\u2077',
    '8': '\u2078',
    '9': '\u2079',
    '+': '\u207A', '(':'\u207D',
    '-': '\u207B', ')':'\u207E'

  };
  var ch = '';
  for( var i in chArray ) {
    ch = chArray[i]
    if( supHash[ch] ) {
      out += supHash[ch];
    } else {
      out += ch;
    }
  }
  return out;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// STRING FORMATTING
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*

tinycolor("#550000")
tinycolor("#553333").desaturate(50).toHsv()
tinycolor("#ff0000").desaturate(50).toHsv()



*/



var SIPREFIX=["k","M","G","T","P","E","Z","Y"]
var SIPREFIXLOW=["m","u","n","p","f","a","z","y"]

var SIPREFIXLONG=["kilo","Mega","Giga","Tera","Peta","Exa","Zetta","Yotta"]
var SIPREFIXExplain=["kilo: Thousands, 1e3","Mega: Millions, 1e6","Giga: Billions, 1e9","Tera: Trillions, 1e12","Peta: Quadrillions, 1e15","Exa: Quintillions, 1e18","Zetta: Sextillions, 1e21","Yotta: Septillions, 1e24"]

/*
function fmtSI(x){
  if(x == 0){
      return "0.00"
  } else if(x < 1){
      var d = -Math.ceil(Math.log10(x))
      var dd = (Math.floor(d / 3))
      var suffix = SIPREFIXLOW[dd];
      var rr = x / Math.pow(10,(-dd)*3)
      return roundTo(rr,1)
  } else {
      if(x < 100){
        return roundTo(x,1)
      } else if(x < 1000){
        return ""+Math.round(x)
      }

      var d = Math.floor(Math.log10(x))
      var dd = Math.floor(d / 3) - 1
      var ddd = Math.floor(dd / 8)
      var ddp = dd - ddd * 8
      var rr = x / Math.pow(10,(dd+1)*3)
      var dp = 2 - (d - ((dd+1)*3))
      var suffix = SIPREFIX[ddp] + "Y".repeat(ddd)
      var longSuffix = SIPREFIXLONG[ddp] + "Yotta".repeat(ddd)
      var suffixExplain = SIPREFIXExplain[ddp]
      if(ddp != 7 && ddd > 0){
        suffixExplain = suffixExplain + "<br>"+ SIPREFIXExplain[ddp]
      }
      return roundTo(rr,dp)
  }
}*/
var yottaCtThreshold = 3
function fmtSIint(x, yottaCtThreshold = 2){
  if(x < 100){
    if(x == Math.floor(x)){
      return ""+Math.floor(x)
    } else {
      return ""+Math.floor(x)+" (+"+roundTo(100*(x - Math.floor(x)),1)+"%)"
    }
  } else if(x < 100){
    if(x == Math.floor(x)){
      return ""+Math.floor(x)
    } else {
      return ""+Math.floor(x)+" (+"+Math.round(100*(x - Math.floor(x)))+"%)"
    }
  } else if(x < 1000){
    return ""+Math.floor(x)
  } else {
      var d = Math.floor(Math.log10(x))
      var dd = Math.floor(d / 3) - 1
      var ddd = Math.floor(dd / 8)
      var dddString = "Y".repeat(ddd)
      if(ddd >= yottaCtThreshold){
         dddString="Y"+supText(""+ddd)
      }
      var ddp = dd - ddd * 8
      var rr = x / Math.pow(10,(dd+1)*3)
      var dp = 2 - (d - ((dd+1)*3))
      var suffix = SIPREFIX[ddp] + dddString
      return roundTo(rr,dp) + suffix
  }
}
function fmtSIintNoPct(x, yottaCtThreshold = 2){
  if(x < 0){
    return 0;
  } else if(x < 100){
    return ""+Math.floor(x)
  } else if(x < 100){
    return ""+Math.floor(x)
  } else if(x < 1000){
    return ""+Math.floor(x)
  } else {
      var d = Math.floor(Math.log10(x))
      var dd = Math.floor(d / 3) - 1
      var ddd = Math.floor(dd / 8)
      var dddString = "Y".repeat(ddd)
      if(ddd >= yottaCtThreshold){
         dddString="Y"+supText(""+ddd)
      }
      var ddp = dd - ddd * 8
      var rr = x / Math.pow(10,(dd+1)*3)
      var dp = 2 - (d - ((dd+1)*3))
      var suffix = SIPREFIX[ddp] + dddString
      return roundTo(rr,dp) + suffix
  }
}



//Returns [0]baseNumber, [1]prefixAbbrev, [2]prefixFull, [3]prefixExponent, [4]a string of prefix descriptions
function fmtSIunits(x, yottaCtThreshold = 2){
  if(x == 0){
      return [0, "", "", 0,""]
  } else if(x < 1){
      var d = -Math.floor(Math.log10(x))
      var dd = (Math.floor((d-1) / 3))
      var suffix = SIPREFIXLOW[dd];
      var rr = x * Math.pow(10,(dd+1)*3)
      var dp = ((d+2) % 3)

      return [roundTo(rr,dp), suffix,"???",dd,"???"]
  } else {
      if(x < 100){
        return [roundTo(x,1), "","",0,""]
      } else if(x < 1000){
        return [Math.round(x), "","",0,""]
      }
      var d = Math.floor(Math.log10(x))
      var dd = Math.floor(d / 3) - 1
      var ddd = Math.floor(dd / 8)
      var dddString = "Y".repeat(ddd)
      if(ddd >= yottaCtThreshold){
         dddString="Y"+supText(""+ddd)
      }
      var ddp = dd - ddd * 8
      var rr = x / Math.pow(10,(dd+1)*3)
      var dp = 2 - (d - ((dd+1)*3))
      var suffix = SIPREFIX[ddp] + dddString
      var longSuffix = SIPREFIXLONG[ddp] + "Yotta".repeat(ddd)
      var suffixExplain = SIPREFIXExplain[ddp]
      if(ddp != 7 && ddd > 0){
        suffixExplain = suffixExplain + "<br>"+ SIPREFIXExplain[ddp]
      }
      return [roundTo(rr,dp), suffix, longSuffix, (dd+1)*3,suffixExplain]
  }
}


function fmtSI(x, delim="", yottaCtThreshold = 2){
  if(x <= 0){
    return 0.0;
  } else if(x < 1){
      var d = -Math.floor(Math.log10(x))
      var dd = (Math.floor((d-1) / 3))
      var suffix = SIPREFIXLOW[dd];
      var rr = x * Math.pow(10,(dd+1)*3)
      var dp = ((d+2) % 3)
      return roundTo(rr,dp)+ suffix
  } else if(x < 100){
    return ""+roundTo(x,1)
  } else if(x < 1000){
    return ""+Math.round(x)
  } else {
      var d = Math.floor(Math.log10(x))
      var dd = Math.floor(d / 3) - 1
      var ddd = Math.floor(dd / 8)
      var dddString = "Y".repeat(ddd)
      if(ddd >= yottaCtThreshold){
         dddString="Y"+supText(""+ddd)
      }
      var ddp = dd - ddd * 8
      var rr = x / Math.pow(10,(dd+1)*3)
      var dp = 2 - (d - ((dd+1)*3))
      var suffix = SIPREFIX[ddp] + dddString
      return roundTo(rr,dp) +delim+ suffix
  }
}

function fmtSIorFrac(x, delim="", yottaCtThreshold = 2){
  if(x <= 0){
    return "0.000";
  } else if(x <= 0.01){
     return ""+roundTo(x,3)
  } else if(x <= 0.1){
     return ""+roundTo(x,2)
  } else if(x <= 1){
     return ""+roundTo(x,2)
  } else if(x < 100){
    return ""+roundTo(x,1)
  } else if(x < 1000){
    return ""+Math.round(x)
  } else {
      var d = Math.floor(Math.log10(x))
      var dd = Math.floor(d / 3) - 1
      var ddd = Math.floor(dd / 8)
      var dddString = "Y".repeat(ddd)
      if(ddd >= yottaCtThreshold){
         dddString="Y"+supText(""+ddd)
      }
      var ddp = dd - ddd * 8
      var rr = x / Math.pow(10,(dd+1)*3)
      var dp = 2 - (d - ((dd+1)*3))
      var suffix = SIPREFIX[ddp] + dddString
      return roundTo(rr,dp) +delim+ suffix
  }
}


function fmtSIflat(x, yottaCtThreshold = 2){
  if(x <= 0){
    return 0.0;
  } else if(x < 1){
      var d = -Math.floor(Math.log10(x))
      var dd = (Math.floor((d-1) / 3))
      var suffix = SIPREFIXLOW[dd];
      var rr = x * Math.pow(10,(dd+1)*3)
      var dp = ((d+2) % 3)
      return roundTo(rr,dp)+ suffix
  } else if(x < 100){
    return ""+Math.round(x)
  } else if(x < 1000){
    return ""+Math.round(x)
  } else {
      var d = Math.floor(Math.log10(x))
      var dd = Math.floor(d / 3) - 1
      var ddd = Math.floor(dd / 8)
      var dddString = "Y".repeat(ddd)
      if(ddd >= yottaCtThreshold){
         dddString="Y"+supText(""+ddd)
      }
      var ddp = dd - ddd * 8
      var rr = x / Math.pow(10,(dd+1)*3)
      var dp = 2 - (d - ((dd+1)*3))
      var suffix = SIPREFIX[ddp] + dddString
      return Math.round(rr) + suffix
  }
}


/*
  fracstyle: one of: ["milli","frac","int"]
*/
function fmtSIadv(x, fracDigits = 2, fracStyle = "milli",delim="", yottaCtThreshold = 2){
  var extraDigits = fracDigits - 2;
  if(x <= 0 ){
    var digits = Math.max(0,2 + extraDigits)
    if(digits > 0){
      return "0."+"0".repeat(digits);
    } else {
      return "0";
    }
  } else if(x < 1 && fracStyle == "int"){
    return 0;
  } else if(x < 1 && fracStyle == "frac"){
    var digits = Math.max(0, 2 + extraDigits);
    return roundTo(x,digits)+"";
  } else if(x < 1 && fracStyle == "milli"){
      var d = -Math.floor(Math.log10(x))
      var dd = (Math.floor((d-1) / 3))
      var suffix = SIPREFIXLOW[dd];
      var rr = x * Math.pow(10,(dd+1)*3)
      var dp = ((d+2) % 3)
      var digits = Math.max(0, dp + extraDigits);
      return roundTo(rr,digits)+suffix;
  } else if(x < 10){
    var digits = Math.max(0,2 + extraDigits);
    var suffix = "";
    return roundTo(x,digits)+suffix;
  } else if(x < 100){
    var digits = Math.max(0,1 + extraDigits);
    var suffix = "";
    return roundTo(x,digits)+suffix;
  } else if(x < 1000){
    var digits = Math.max(0,0 + extraDigits);
    var suffix = "";
    return roundTo(x,digits)+suffix;
  } else {
      var d = Math.floor(Math.log10(x))
      var dd = Math.floor(d / 3) - 1
      var ddd = Math.floor(dd / 8)
      var dddString = "Y".repeat(ddd)
      if(ddd >= yottaCtThreshold){
         dddString="Y"+supText(""+ddd)
      }
      var ddp = dd - ddd * 8
      var rr = x / Math.pow(10,(dd+1)*3)
      var dp = 2 - (d - ((dd+1)*3))
      var suffix = SIPREFIX[ddp] + dddString;
      var digits = Math.max(0,dp + extraDigits);
      return roundTo(rr,digits) +delim+ suffix
  }
}


//Returns [0]baseNumber, [1]prefixAbbrev, [2]prefixFull, [3]prefixExponent, [4]a string of prefix descriptions
function fmtSIlog(x){
  if(x == 0){
      return [1, "", "", 1,""]
  } else if(x <= -3){
      return [0, "", "", 0,""]
  } else if(x < 0){
      var d = -Math.ceil(x)
      var dd = Math.floor( d / 3 )
      var suffix = SIPREFIXLOW[dd]
      var rr = Math.pow(10,( x - d ))
      return [roundTo(rr,1), suffix,"",dd,""]
  } else {
      if(x < 2){
        return [roundTo(Math.pow(10,x),1),"","",0,""]
      } else if(x < 3){
        return [Math.round(Math.pow(10,x)),"","",0,""]
      }
      var d = Math.floor(x)
      var dd = Math.floor(d / 3) - 1
      var ddd = Math.floor(dd / 8)
      var ddp = dd - ddd * 8
      var rr = Math.pow( 10, x - (dd+1)*3 )
      var dp = 2 - (d - ((dd+1)*3))
      var suffix = SIPREFIX[ddp] + "Y".repeat(ddd)
      var longSuffix = SIPREFIXLONG[ddp] + "Yotta".repeat(ddd)
      var suffixExplain = SIPREFIXExplain[ddp]
      if(ddp != 7 && ddd > 0){
        suffixExplain = suffixExplain + "<br>"+ SIPREFIXExplain[ddp]
      }
      return [roundTo(rr,dp), suffix, longSuffix, (dd+1)*3,suffixExplain]
  }
}

function fmtSIreal(x){
    var sign = "";
    if(x < 0){
      x = -x
      sign = "-";
    }
    return sign + fmtSI(x," ");

}


function fmtSIdelta(x){
    var sign = "+";
    if(x < 0){
      x = -x
      sign = "-";
    }
    return sign + fmtSI(x," ");
}
GAME_GLOBAL.fmtSIdelta = fmtSIdelta

//var SIPREFIXLONG=["kilo","Mega","Giga","Tera","Peta","Exa","Zetta","Yotta"]
//var SIPREFIXExplain=["kilo: Thousands, 1e3","Mega: Millions, 1e6","Giga: Billions, 1e9","Tera: Trillions, 1e12","Peta: Quadrillions, 1e15","Exa: Quintillions, 1e18","Zetta: Sextillions, 1e21","Yotta: Septillions, 1e24"]


function getPrefixSI(x){
  if(x < 1000){
    return ""
  }
  var d = Math.floor(Math.log10(x))
  var dd = Math.floor(d / 3) - 1
  var ddd = Math.floor(dd / 8)
  var ddp = dd - ddd * 8
  var prefix = SIPREFIX[ddp] + "Y".repeat(ddd)
  return prefix
}







function ExactLargeNumber( varray ){
    var maxExact = 1000000000000000
    var digitCt  = 15;

    this.getFullString = function(){
        //var out = ""+varray[length(varray)-1];
        var out = ""
        for(var i=0; i < length(varray)-1; i++){
            var xx = ""+varray[i]
            out = "0".repeat( digitCt-xx.length ) + xx + out;
        }
        out = varray[length(varray)-1] + out
        return out;
    }
    this.add = function(x){
        var carryDigit = 0;
        for(var i=0; i < Math.max( varray.length,x.length) ; i++){
           if(i < x.length && i < varray.length){
               var currsum = varray[i] + carryDigit + x[i];
               if(currsum >= maxExact){
                   varray[i] = currsum - maxExact;
                   carryDigit = 1;
               } else {
                   varray[i] = currsum
                   carryDigit = 0;
               }
           } else if(i < x.length){
               varray[i] = x[i] + carryDigit
               carryDigit = 0;
           } else {
               varray[i] = varray[i] + carryDigit
               carryDigit = 0;
           }
        }
    }
    this.gt = function(x){
        if(varray.length == x.length){
            for(var i=length(varray)-1; i >= 0; i--){
                if(varray[i] < x[i]){
                    return false;
                } else if(varray[i] > x[i]){
                    return true;
                }
            }
            return false;
        } else if(varray.length < x.length){
            return false;
        } else {
            return true;
        }
    }
    this.eq = function(x){
        if(varray.length == x.length){
            for(var i=length(varray)-1; i >= 0; i--){
                if(varray[i] != x[i]){
                    return false;
                }
            }
            return true;
        } else {
            return true;
        }
    }
    this.subtract = function(x){
        var pullDigit = 0;
        for(var i=0; i < varray.length ; i++){
           if(i < x.length){
               var currsum = varray[i] - pullDigit - x[i];
               if(currsum >= 0){
                   varray[i] = currsum;
                   pullDigit = 0;
               } else {
                   varray[i] = currsum + maxExact
                   pullDigit = 1;
               }
           } else {
               if(varray[i] == 0){
                   varray[i] = maxExact - pullDigit;
                   pullDigit = 1;
               } else {
                   varray[i] = varray[i] - pullDigit
                   pullDigit = 0;
               }
           }
        }
    }
}







//drawFromRandomDistro([1,0.5,0.25],"ifLow",-1, "", true)

function drawFromRandomDistro(xx,normalize = "yes", defaultResult=-1, debugNote = "", verbose=false){
   //options for normalize are yes, no, ifLow, ifHigh
   if(["yes","no","ifLow","ifHigh"].indexOf(normalize) == -1){
      console.log("WARNING: normalize must be one of: yes,no,ifHigh,ifLow. Found: \""+normalize+"\"")
   }
   if(xx == null){
     console.log("xx == null: "+debugNote);
   }
   //console.log("xx == "+xx);
   if(verbose){ console.log("     randomDistro["+xx.join(",")+"]") }
   var xlo = [];
   var xhi = [];
   var total = 0;
   for(var i=0; i < xx.length; i++){
       xlo[i] = total;
       xhi[i] = total + xx[i];
       total = total + xx[i];
   }
   if(verbose){ console.log("             xlo["+xlo.join(",")+"]") }
   if(verbose){ console.log("             xhi["+xhi.join(",")+"]") }
   if(verbose){ console.log("           total="+total) }

   if( total != 1 ){
     if(normalize == "yes" || (normalize == "ifLow" && total < 1) || (normalize == "ifHigh" && total > 1) ){
       for(var i=0; i < xx.length; i++){
           xlo[i] = xlo[i] / total;
           xhi[i] = xhi[i] / total;
       }
     }
   }
   if(verbose){ console.log("             xlo["+xlo.join(",")+"]") }
   if(verbose){ console.log("             xhi["+xhi.join(",")+"]") }

   var rr = Math.random();
   if(verbose){ console.log("             rr="+rr) }

   for(var i=0; i < xx.length; i++){
     if( rr <= xhi[i] && rr >= xlo[i] ){
          if(verbose){ console.log("             i="+i) }
       return i;
     }
   }
   return defaultResult;
}





