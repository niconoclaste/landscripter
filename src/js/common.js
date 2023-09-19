if(window.location.pathname === '/' && window.location.hash === ''){
  window.location.href = window.location.href + 'greenmaze.html#waterfall';
}else if(window.location.pathname === '/greenmaze.html' && window.location.hash === ''){
  window.location.href = window.location.href + '#waterfall';
}

function logout(text){console.log(text)};
let debug = false; // debug state
if(window.location.href.indexOf('?debug=true') > -1){
  debug = true;
}
let parameter = '';
if(debug === true){
  parameter = '?debug=true';
}

let _deco = [];
let _obstacles = [];
let _MessageZones = [];
let _MaskZones = [];
let _exitZones = [];
let gameBorders = [];

let obstBg =            false;
let obstOpacity =       false;
let gameBorderColor =   'rgba(255,255,255,0)';
let messageZoneColor =  'rgba(239, 114, 147, 0)';
let zoneExitColor =     'rgba(255, 255, 0, 0)';
let maskZoneColor =     'rgba(0,0,0,1)';
if(debug === true){
  obstBg =              'rgba(255,255,255,0.5)';
  obstOpacity =         '.5';
  gameBorderColor =     'white';
  messageZoneColor =    'rgba(239, 114, 147, 0.8)';
  zoneExitColor =       'rgba(255, 255, 0, 0.8)';
  maskZoneColor =       'rgba(0,0,0,0.5)';
}

let logOk = true;


/*

nigelOrientationX  ->  'left'  or  'right'

nigelOrientationY  ->  'up'  or  'bottom'

*/
