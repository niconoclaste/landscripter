const mapImage = '/img/maps/bigTree.gif';
const bgFullWidth = 988;
const bgFullHeight = 547;

let bgLeft = 0;
let bgTop = 0;

let mapLeft = 190;
let mapTop = 0;

let NigelTileLeftStart = 310;
let NigelTileTopStart = 400;
let nigelOrientationX = 'right';
let nigelOrientationY = 'up';

if(location.hash == '#bigTreeRight'){
  mapLeft = -150;
  NigelTileLeftStart = 610;
  NigelTileTopStart = 400;
  nigelOrientationX = 'left';
  nigelOrientationY = 'up';
}

gameBorders = [
  [348, 394],
  [279, 359],
  [241, 385],
  [227, 433],
  [254, 473],
  [276, 485],
  [258, 527],
  [291, 553],
  [344, 525],
  [373, 522],
  [445, 540],
  [521, 542],
  [590, 529],
  [604, 522],
  [632, 522],
  [712, 564],
  [736, 545],
  [708, 487],
  [747, 457],
  [760, 417],
  [746, 387],
  [696, 356],
  [596, 386],
  [563, 405],
  [580, 422],
  [601, 425],
  [597, 434],
  [576, 437],
  [530, 419],
  [520, 419],
  [501, 415],
  [489, 420],
  [476, 429],
  [485, 451],
  [477, 454],
  [452, 437],
  [445, 410],
  [431, 401],
  [399, 406],
];

_obstacles = [];
//32 / 16
_MessageZones = [];
    
let exit1 =[
  [274, 498],
  [325, 535],
  [293, 552],
  [260, 526],
  [270, 503],
];
let exit2 =[
  [657, 535],
  [715, 505],
  [736, 546],
  [714, 562],
  [661, 539],
];

_exitZones = [
  [exit1, '/greenmaze.html' + parameter + '#road2masanTreeLeft'],
  [exit2, '/greenmaze.html' + parameter + '#road2masanTreeRight'],
];