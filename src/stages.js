let debug = false; // debug state
if(window.location.href.indexOf('?debug=true') > -1){
  debug = true;
}


let _deco = [];
let _obstacles = [];
let _MessageZones = [];
let _exitZones = [];
let gameBorders = [];



function getScene(){
  _deco = [];
  _obstacles = [];
  _MessageZones = [];
  _exitZones = [];
  gameBorders = [];

  
function scene(){
  let theHash = location.hash;
  return theHash.substr(1);
  // let index = window.location.href.lastIndexOf('/') + 1;
  // let filenameWithExtension = window.location.href.substr(index);
  // let filename = filenameWithExtension.split('.')[0];
  // if(filename != ''){
  //   return filename; 
  // }else{
  //   return 'waterfall';
  // } 
}

function comeFrom(){
  // let theHash = location.hash;
  // if(theHash.indexOf('?debug=true') > -1){
  //   theHash = theHash.split('?debug=true')[0];
  // }
  // if(theHash.indexOf('#') > -1){
  //   return theHash.substr(1);
  // }else{
    return 'shrine';
  // }
}




// if(scene() === 'waterfall'){

// }
// if(scene() === 'waterfall' && comeFrom() === 'greenmaze'){
//   mapLeft = 4000;
//   mapTop = 3200;
//   nigelOrientationX = 'left';
//   nigelOrientationY = 'up';
//   nigelLeftStart = 964 + 670;
//   nigelTopStart = 1501 - 305;
//   NigelSliceLeftStart = 972 + 670;
//   NigelSliceTopStart = 1430 - 305;
// }
// if(scene() === 'greenmaze' && comeFrom() === 'waterfall'){
//   mapLeft = 3924;
//   mapTop = 3162;
//   nigelOrientationX = 'right';
//   nigelOrientationY = 'down';
//   nigelLeftStart = 964 + 745;
//   nigelTopStart = 1501 - 265;
//   NigelSliceLeftStart = 972 + 745;
//   NigelSliceTopStart = 1430 - 265;
// }


if(scene() === 'waterfall'){
  gameBorders = [
    [0, 1372],
    [576, 1082],
    [633, 1113],
    [793, 1034],
    [800, 1032],
    [738, 1002],
    [1040, 850],
    [1102, 879],
    [1084, 892],
    [1789, 1246],
    [1729, 1277],
    [1450, 1135],
    [785, 1470],
    [401, 1373],
    [758, 1554],
    [759, 1602],
    [804, 1586],
    [799, 1544],
    [874, 1513],
    [898, 1528],
    [1437, 1259],
    [1640, 1359],
    [804, 1777]
    ];
  
    _deco = [
      [32,16,"img/fence.gif",732,1016,"fill","bloc","","","deco",false]
    ];
  
    _obstacles = [
      ['pillar',1024,1449],
      ['pillar',864,1528],
      ['thicket',826,1545],
      ['thicket',790,1563],
      ['thicket',218,1338],
      ['thicket',250,1354],
      ['thicket',282,1370],
      ['thicket',314,1386],
      ['thicket',346,1402],
      ['thicket',378,1418],
      ['thicket',410,1434],
      ['thicket',442,1450],
      ['thicket',474,1466],
      ['thicket',506,1482],
      ['thicket',538,1498],
      ['thicket',602,1530],
      ['thicket',634,1546],
      ['thicket',666,1562],
      ['thicket',698,1578],
      ['tree',1148,1069],
      ['tree',1116,1085],
      ['tree',1084,1101],
      ['tree',1052,1117],
      ['tree',1020,1133],
      ['tree',988,1149],
      ['tree',956,1165],
      ['tree',924,1181],
      ['tree',892,1197],
      ['tree',860,1213],
      ['tree',828,1229],
      ['tree',796,1245],
      ['tree',764,1261],
      ['tree',732,1277],
      ['tree',700,1293],
      ['tree',668,1309],
      ['tree',1180,1085],
      ['tree',1212,1101],
      ['tree',1244,1117],
      ['tree',1276,1133],
      ['tree',1148,1133],
      ['tree',1084,1165],
      ['tree',1020,1197],
      ['tree',956,1229],
      ['tree',892,1261],
      ['tree',828,1293],
      ['tree',764,1325],
      ['tree',1276,1133],
      ['tree',1244,1149],
      ['tree',1212,1165],
      ['tree',1180,1181],
      ['tree',1148,1197],
      ['tree',1116,1213],
      ['tree',1084,1229],
      ['tree',1052,1245],
      ['tree',1020,1261],
      ['tree',988,1277],
      ['tree',956,1293],
      ['tree',924,1309],
      ['tree',892,1325],
      ['tree',860,1341],
      ['tree',828,1357],
      ['tree',796,1373],
      ['tree',508,1261],
      ['tree',540,1277],
      ['tree',572,1293],
      ['tree',604,1309],
      ['tree',636,1325],
      ['tree',668,1341],
      ['tree',700,1357],
      ['tree',732,1373],
      ['tree',764,1389],
      ['tree',476,1277],
      ['tree',444,1293],
      ['tree',412,1309],
      ['tree',380,1325],
      ['tree',348,1341],
      ['thicket',506,1291],
      ['thicket',538,1307],
      ['thicket',570,1323],
      ['thicket',602,1339],
      ['thicket',474,1305],
      ['thicket',506,1321],
      ['thicket',538,1337],
      ['thicket',570,1353],
      ['thicket',602,1369],
      ['thicket',634,1385],
      ['thicket',442,1321],
      ['thicket',474,1337],
      ['thicket',410,1337],
      ['tree',956,1325],
      ['tree',28,1373],
      ['tree',60,1389],
      ['tree',92,1405],
      ['thicket',699,1705],
      ['thicket',731,1721],
      ['thicket',763,1737],
      ['tree',1436,1311],
      ['tree',1404,1327],
      ['tree',1372,1343],
      ['tree',1340,1359],
      ['tree',1308,1375],
      ['tree',1276,1391],
      ['tree',1244,1407],
      ['tree',1212,1423],
      ['tree',1180,1439],
      ['tree',1468,1327],
      ['tree',1212,1455],
      ['tree',1500,1343],
      ['tree',1468,1359],
      ['tree',1436,1375],
      ['tree',1404,1391],
      ['tree',1372,1407],
      ['tree',1340,1423],
      ['tree',1308,1439],
      ['tree',1276,1455],
      ['tree',1244,1471]
    ]
  
    let change1 = [
    [947, 1523],
    [929, 1512],
    [927, 1493],
    [972, 1473],
    [986, 1478],
    [1004, 1492]
    ];
  
    let change2 = [
    [1680, 1189],
    [1621, 1220],
    [1697, 1258],
    [1756, 1226]
    ];
  
  _MessageZones = [
    //[change1, 'Go to the cave zone'],
    //[change2, 'Go to the main map'],
    ];
  
  
    let exit1 = [
    [947, 1523],
    [929, 1512],
    [927, 1493],
    [972, 1473],
    [986, 1478],
    [1004, 1492]
    ];
  
  
    let exit2 = [
  [1725, 1272],
  [1781, 1241],
  [1787, 1246],
  [1729, 1275],
    ];

  _exitZones = [
    [exit1, '#shrine'],
    [exit2, '#greenmaze'],
  ];

}
if(scene() === 'greenmaze'){

  gameBorders = [
    [1665, 1243],
    [1724, 1214],
    [1855, 1281],
    [1987, 1202],
    [1986, 1133],
    [2017, 1107],
    [2045, 1103],
    [2061, 1129],
    [2119, 1199],
    [2238, 1247],
    [2406, 1157],
    [2431, 1167],
    [2638, 1273],
    [2780, 1198],
    [2879, 1247],
    [3103, 1132],
    [3073, 1097],
    [3244, 1009],
    [3380, 929],
    [3314, 882],
    [3482, 790],
    [3613, 852],
    [3612, 882],
    [3642, 899],
    [3762, 843],
    [3820, 875],
    [3715, 934],
    [3857, 1002],
    [3312, 1292],
    [3485, 1377],
    [3187, 1533],
    [3116, 1605],
    [3194, 1660],
    [3014, 1757],
    [2795, 1652],
    [2604, 1550],
    [2381, 1556],
    [2328, 1576],
    [2169, 1504],
    [2359, 1415],
    [2422, 1421],
    [2487, 1449],
    [2532, 1433],
    [2595, 1464],
    [2670, 1505],
    [2782, 1448],
    [2980, 1496],
    [2779, 1394],
    [2683, 1439],
    [2373, 1290],
    [2372, 1288],
    [2239, 1333],
    [2069, 1275],
    [1894, 1358]
    ];
    
    
    _obstacles = [
      ['tree',1978, 1200],
      ['tree',1946, 1216],
      ['tree',1914, 1232],
      ['tree',1850, 1264],
    
      ['tree',2042, 1168],
      ['tree',2074, 1184],
      ['tree',2106, 1200],
      ['tree',2138, 1216],
    ];
    //32 / 16
    _MessageZones = [];
    
    let exit1 =[
    [1727, 1217],
    [1756, 1226],
    [1697, 1258],
    [1670, 1243]
    ];
   
_exitZones = [
  [exit1, '#waterfall'],
  ];
   
}
}


getScene();

window.addEventListener("hashchange", getScene, false);