
// bgLeft, bgTop,
let mooveFromLeft = 0;
let mooveFromTop = 0;

const bgFullWidth = 11488;
const bgFullHeight = 5352;
const mapImage = 'img/fullmap1.gif';

let bgLeft = -5952;
let bgTop = -53;
let mapLeft = 4750;
let mapTop = 2950;
let nigelOrientationX = 'right';
let nigelOrientationY = 'down';
let nigelLeftStart = 964;
let nigelTopStart = 1501;
let NigelSliceLeftStart = 972;
let NigelSliceTopStart = 1430;



let Obstacles = []; // list of blocking obstacles
let Deco = []; // list of non blocking decorations
let MessageZone = []; // list of zones before exit stage (throw message)
let ExitZone = []; // list of stage exit zones (redirect to another stage/page)
let GameBackground; // background image of the zone
let GameBorder; // limits of the zone
let Nigel; // Nigel tile (for checking obstacles and limits / invisible)
let NigelSlice; // Nigel animated slice

let isjumping = false; // Nigel jumping state
let isfalling = false; // Nigel falling state (after jump ends)

const goRight = 39;   // right arrow keybord key
const goLeft = 37;   // left arrow keybord key
const goUp = 38;     // up arrow keybord key
const goDown = 40;   // down arrow keybord key
const jump = 32      // SPACE keybord key
const attack = 88    // x keybord key
//var attack = 65    // a keybord key

let fullWidth = window.innerWidth; // window width -> canvas width
let fullHeight = window.innerHeight; // window height -> canvas height

var respLeft = (fullWidth / 2) - (bgFullWidth / 2) + mapLeft;
var respTop = ((fullHeight / 2) - (bgFullHeight / 3)) - (bgFullHeight / 2) + mapTop;

let tileWidth = 32; // default tile width
let tileHeight = 16; // default tile height -> tile width / 2
const moveValX = 4; // horizontal move amount (px)
const moveValY = 2; // vertical move amount (px) -> horizontal move / 2
const animInterval = 6; // frame rate
const gameInterval = 20; // ??
// const gameInterval = 50; // ??

let boxWidth = 0;
let boxHeight = 0;
let endedX = false;
let endedY = false;
let closeX = false;
let closeY = false;

let treeBg = false;
let treeOpacity = false;
let gameBorderColor = 'rgba(255,255,255,0)';
let zoneChangeColor = 'rgba(239, 114, 147, 0)';
let zoneExitColor = 'rgba(234, 88, 249, 0)';
if(debug === true){
  treeBg = 'rgba(255,255,255,0)';
  treeOpacity = '0.3';
  gameBorderColor = 'rgba(255,255,255,1)';
  zoneChangeColor = 'rgba(239, 114, 147, 0.5)';
  zoneExitColor = 'rgba(234, 88, 249, 0.5)';
}

// animation frame request
const frameLoop = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

// check if one coord (point) is inside an array of coords (poly)
/*
point = [left, top]
poly = [
  [top point left, top point top], 
  [left point left, left point top], 
  [bottom point left, bottom point top], 
  [right point left, right point top]
]
*/
function inside(point, poly){
  const x = point[0];
  const y = point[1];
  let inside = false;
  let xi;
  let xj;
  let intersect;
  for(let i = 0, j = poly.length - 1; i < poly.length; j = i++){
    xi = poly[i][0], yi = poly[i][1];
    xj = poly[j][0], yj = poly[j][1];
    intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if(intersect){
      inside = !inside;
    }
  }
  return inside;
}


function startGame(){
  GameArea.start();
  //  new GameElement(width, height, [color/image], left, top, [fill/stroke], [bloc/slice/limit/image], coords, doAction, is, level to climb)

  _deco.forEach(function(element){
    Deco.push(new GameElement(...element));
  });

  _obstacles.forEach(function(element){
    let isJumpable = element[0] == 'thicket' ? 1 : false;
    element[0] = 'img/'+element[0]+'.gif';
    Obstacles.push(new GameElement(tileWidth, tileHeight, ...element, "fill","bloc","","","obstacle",isJumpable));
  });

  _MessageZones.forEach(function(element) {
    MessageZone.push(new GameElement(tileWidth * 3, tileHeight * 3, zoneChangeColor, 0, 0, 'fill', 'bloc', element[0], element[1], 'MessageZone', false));
  });

  _exitZones.forEach(function(element) {
    ExitZone.push(new GameElement(tileWidth * 3, tileHeight * 3, zoneExitColor, 0, 0, 'fill', 'bloc', element[0], element[1], 'exitZone', false));
  });

  Nigel = new GameElement(tileWidth, tileHeight, 'tansparent', nigelLeftStart, nigelTopStart, 'stroke', 'bloc', '', '', 'Nigel', 0);
  NigelSlice = new GameElement(508, 462, 'img/nigel.gif', NigelSliceLeftStart, NigelSliceTopStart, '', 'slice', '', '', 'NigelSlice','');
  GameBorder = new GameElement(fullWidth, fullHeight, gameBorderColor, 0, 0, 'stroke', 'limit', gameBorders, '', 'gameBorder', '');
  GameBackground = new GameElement(bgFullWidth, bgFullHeight, mapImage, bgLeft, bgTop, '', 'image', '', '', 'gameBackground', '');



  window.addEventListener("hashchange", function(){
    Obstacles = [];
    Deco = [];
    MessageZone = [];
    ExitZone = [];
    
    _deco.forEach(function(element){
      element[3] = mooveFromLeft + element[3];
      element[4] = mooveFromTop + element[4];
      Deco.push(new GameElement(...element));
    });
    _obstacles.forEach(function(element){
      let isJumpable = element[0] == 'thicket' ? 1 : false;
      element[0] = 'img/'+element[0]+'.gif';
      element[1] = mooveFromLeft + element[1];
      element[2] = mooveFromTop + element[2];
      Obstacles.push(new GameElement(tileWidth, tileHeight, ...element, "fill","bloc","","","obstacle",isJumpable));
    });
    _MessageZones.forEach(function(element) {
      MessageZone.push(new GameElement(tileWidth * 3, tileHeight * 3, zoneChangeColor, mooveFromLeft, mooveFromTop, 'fill', 'bloc', element[0], element[1], 'MessageZone', false));
    });
    _exitZones.forEach(function(element) {
      ExitZone.push(new GameElement(tileWidth * 3, tileHeight * 3, zoneExitColor, mooveFromLeft, mooveFromTop, 'fill', 'bloc', element[0], element[1], 'exitZone', false));
    });
    GameBorder = new GameElement(fullWidth, fullHeight, gameBorderColor, mooveFromLeft, mooveFromTop, 'stroke', 'limit', gameBorders, '', 'gameBorder', '');
  }, false);


}

// start states
let canMove = true;
let canMoveRightBottom = false;
let canMoveRightUp = false;
let canMoveLeftBottom = false;
let canMoveLeftUp = false;
let isMoving = false;

var GameArea = {
  canvas : document.createElement('canvas'),
  start : function(){
    this.canvas.id = 'canvas';
    this.canvas.width = fullWidth;
    this.canvas.height = fullHeight;
    this.context = this.canvas.getContext('2d');
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.keys = [];
    this.keys[goUp] = false;
    this.keys[goDown] = false;
    this.keys[goRight] = false;
    this.keys[goLeft] = false;
    this.keys[jump] = false;
    this.keys[attack] = false;

    // resize the map and elements according to the browser zoom 
    window.addEventListener('resize', function(e){
      const movetoX = (window.innerWidth - this.canvas.width) / 2;
      const movetoY = (window.innerHeight - this.canvas.height) / 2;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      setTranslate(movetoX, movetoY);
    });

    if(debug === true){
      // log where the mouse is pointing
      var theCanvas = document.getElementById('canvas');
      theCanvas.addEventListener('click', function(e){
        var rect = theCanvas.getBoundingClientRect();
        var x = (Math.floor((e.clientX - rect.left) / (rect.right - rect.left) * theCanvas.width)) - GameBackground.x + bgLeft;
        var y = (Math.floor((e.clientY - rect.top) / (rect.bottom - rect.top) * theCanvas.height)) - GameBackground.y + bgTop;
        console.log('['+Math.round(x)+', '+Math.round(y)+'],');
      });

      // drag an drop map and elements
      const BB = this.canvas.getBoundingClientRect();
      const offsetX = BB.left;
      const offsetY = BB.top;   
      let dragok = false;
      let startX;
      let startY;
    
      window.addEventListener('mousedown', function(e){
        e.preventDefault();
        e.stopPropagation();
        const mx = parseInt(e.clientX - offsetX);
        const my = parseInt(e.clientY - offsetY);
        dragok = false;
        dragok = true;
        startX = mx;
        startY = my;
      });

      window.addEventListener('mouseup', function(e){
        e.preventDefault();
        e.stopPropagation();
        dragok = false;
      });

      window.addEventListener('mousemove', function(e){
        if(dragok){
          e.preventDefault();
          e.stopPropagation();
          const mx = parseInt(e.clientX - offsetX);
          const my = parseInt(e.clientY - offsetY);
          const dx = mx - startX;
          const dy = my - startY;
          setTranslate(dx, dy);
          startX = mx;
          startY = my;
        }
      });
    }

    // change elements position
      function setTranslate(xPos, yPos){
        const movetoX = xPos;
        const movetoY = yPos;
        GameArea.clear();
        GameBackground.moveValX = movetoX;
        GameBackground.moveValY = movetoY;
        GameBackground.newPos();
        GameBackground.update();
        
        GameBorder.moveValX = movetoX;
        GameBorder.moveValY = movetoY;
        GameBorder.newPos();
        GameBorder.update();

        for(let i = 0; i < MessageZone.length; i++){
          MessageZone[i].moveValX = movetoX;
          MessageZone[i].moveValY = movetoY;
          MessageZone[i].newPos();
          MessageZone[i].update();
        }

        for(let i = 0; i < ExitZone.length; i++){
          ExitZone[i].moveValX = movetoX;
          ExitZone[i].moveValY = movetoY;
          ExitZone[i].newPos();
          ExitZone[i].update();
        }

        for(let i = 0; i < Obstacles.length; i++){
          if(Obstacles[i].zIndex == 0){
            Obstacles[i].moveValX = movetoX;
            Obstacles[i].moveValY = movetoY;
            Obstacles[i].newPos();
            Obstacles[i].update();
          }
        }

        for(let i = 0; i < Deco.length; i++){
          if(Deco[i].zIndex == 0){
            Deco[i].moveValX = movetoX;
            Deco[i].moveValY = movetoY;
            Deco[i].newPos();
            Deco[i].update();
          }
        }

        NigelSlice.moveValX = movetoX;
        NigelSlice.moveValY = movetoY;
        NigelSlice.newPos();
        NigelSlice.update();

        Nigel.moveValX = movetoX;
        Nigel.moveValY = movetoY;
        Nigel.newPos();
        Nigel.update();

        for(let i = 0; i < Obstacles.length; i++){
          if(Obstacles[i].zIndex > 0){
            Obstacles[i].moveValX = movetoX;
            Obstacles[i].moveValY = movetoY;
            Obstacles[i].newPos();
            Obstacles[i].update();
          }
        }          
        for(let i = 0; i < Deco.length; i++){
          if(Deco[i].zIndex > 0){
            Deco[i].moveValX = movetoX;
            Deco[i].moveValY = movetoY;
            Deco[i].newPos();
            Deco[i].update();
          }
        }
      }


    // keydown event listener
    window.addEventListener('keydown', function(e){
      GameArea.keys = (GameArea.keys || []);
      if(e.keyCode == goRight || e.keyCode == goLeft || e.keyCode == goUp || e.keyCode == goDown){
        GameArea.keys[e.keyCode] = (e.type == 'keydown');
        isMoving = true;
        canMoveRightBottom = true;
        canMoveRightUp = true;
        canMoveLeftBottom = true;
        canMoveLeftUp = true;
        e.preventDefault();
      }
      if(e.keyCode == jump){
        if(!isjumping && !isfalling){
          isjumping = true;
          isfalling = false;
          for(var i = 0; i < 13; i++){
            setTimeout(function() {
              updatePosForJump(6, true);
            }, 15 * i);
          }
          setTimeout(function(){
            if(isjumping && !isfalling){
              isjumping = false;
              isfalling = true;
              for(var i = 0; i < 13; i++){
                setTimeout(function(){
                  updatePosForJump(-6, true);
                }, 15 * i);
              }
              setTimeout(function(){
                if(!isjumping && isfalling){
                  isjumping = false;
                  isfalling = false;
                }
              }, 210);
            }
          }, 210);
        }
        e.preventDefault();
      }
    });

    // keyup event listener
    window.addEventListener('keyup', function(e){
      if(e.keyCode == goRight || e.keyCode == goLeft || e.keyCode == goUp || e.keyCode == goDown){
        GameArea.keys[e.keyCode] = (e.type == 'keydown'); 
        if(!GameArea.keys[goRight] && !GameArea.keys[goLeft] && !GameArea.keys[goUp] && !GameArea.keys[goDown]){
          isMoving = false;
          canMoveRightBottom = false;
          canMoveRightUp = false;
          canMoveLeftBottom = false;
          canMoveLeftUp = false;
        }
        canMove = true;
      }
      if(e.keyCode == jump){
        canMove = true;
      }
    });
  }, 
  clear : function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop : function(){
    clearInterval(this.interval);
  }
};

// check if argument is an image
function checkImage(string){
  if(string.indexOf('.gif') > 0 || string.indexOf('.jpg')  > 0 || string.indexOf('.png') > 0 ){
    return true;
  }else{
    return false;
  }
}

let GameElement = function(width, height, color, x, y, blocType, type, coords, doAction, is, level){
  
  this.respLeft = respLeft;
  this.respTop = respTop;
  this.type = type;
  this.doAction = doAction;
  this.gamearea = GameArea;
  this.color = color;
  this.coords = coords;
  this.level = level;
  this.opened = false;
  if(this.type == 'image'){
    this.image = new Image();
    this.image.onload = function() { document.body.classList.remove('loading'); }
    this.image.src = color;
    this.width = width;
    this.height = height;
  }else if(this.type == 'slice'){
    this.dirX = nigelOrientationX;
    this.dirY = nigelOrientationY;
    this.action = 'wait';
    this.image = new Image();
    this.image.src = this.color;
    this.spriteWidth = 124;
    this.spriteHeight = 100;
    this.sliceColls = 8;
    this.sliceRows = 13;
    this.width = this.sliceColls * this.spriteWidth;
    this.height = this.sliceRows * this.spriteHeight;
    this.sliceLeft = 0;
    this.sliceTop = 0;
    this.srcX = this.sliceLeft * this.spriteWidth;
    this.srcY = this.sliceTop * this.spriteHeight;
  }else if(this.type == 'bloc'){
    this.width = width * 2;
    this.height = height * 2;
    if(blocType == 'fill'){
      if(checkImage(this.color)){
        this.image = new Image();
        this.image.src = this.color;
      }
    }
  }else if(this.type == 'limit'){
    this.width = width;
    this.height = height;
  }
  this.x = this.respLeft + x;
  this.y = this.respTop + y;
  this.moveValX = 0;
  this.moveValY = 0;
  this.movejumpValY = 0;
  this.levelPosY = 0;

  this.moveSlide = 0;

  this.x += this.moveValX;
  this.y += this.moveValY;
  this.zIndex = 0;
  this.reached = false;
  this.jumpable = level;
/*
  if(this.color.indexOf('thicket') > 0){
    this.jumpable = 1;
  }else{
    this.jumpable = false;
  }
*/
  this.update = function(){
    var ctx = GameArea.context;
    if(this.type == 'image'){
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }else if(this.type == 'slice'){
      this.srcX = (this.sliceLeft + this.moveSlide) * this.spriteWidth;
      this.srcY = this.sliceTop * this.spriteHeight;
      ctx.drawImage(this.image, this.srcX, this.srcY, this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth, this.spriteHeight);
    }else if(this.type == 'limit'){
      if(this.coords !== ''){
        ctx.beginPath();
        ctx.moveTo(this.x + this.coords[0][0], this.y + this.coords[0][1]);
        for(var i = 1; i < this.coords.length; i ++){
          ctx.lineTo(this.x + this.coords[i][0], this.y + this.coords[i][1]);
        }
        ctx.closePath();
      }

      if(blocType == 'stroke'){
        ctx.strokeStyle = this.color;
        ctx.save();
        ctx.clip();
        ctx.lineWidth *= 2;
        ctx.stroke();
        ctx.restore();
      }else if(blocType == 'fill'){
        ctx.fillStyle = this.color;
        ctx.fill();
      }

    }else if(this.type == 'bloc'){
      if(this.coords !== ''){
        ctx.beginPath();
        ctx.moveTo(this.x + this.coords[0][0], this.y + this.coords[0][1]);
        for(var i = 1; i < this.coords.length; i ++){
          ctx.lineTo(this.x + this.coords[i][0], this.y + this.coords[i][1]);
        }
        ctx.closePath();
        if(blocType == 'stroke'){
          ctx.strokeStyle = this.color;
          ctx.save();
          ctx.clip();
          ctx.lineWidth *= 2;
          ctx.stroke();
          ctx.restore();
        }else if(blocType == 'fill'){
          ctx.fillStyle = this.color;
          ctx.fill();
        }
        
      }else{
        var startPathX = this.x;
        var startPathY = this.y + (this.height / 2);
        var point1X = this.x + (this.width / 2);
        var point1Y = this.y;
        var point2X = this.x + this.width;
        var point2Y = this.y + (this.height / 2);
        var point3X = this.x + (this.width / 2);
        var point3Y = this.y + this.height;
        

        if(blocType == 'stroke'){
          ctx.beginPath();
          ctx.moveTo(startPathX, startPathY);
          ctx.lineTo(point1X, point1Y);
          ctx.lineTo(point2X, point2Y);
          ctx.lineTo(point3X, point3Y);
          ctx.closePath();
          ctx.strokeStyle = this.color;
          ctx.save();
          ctx.clip();
          ctx.lineWidth *= 2;
          ctx.stroke();
          ctx.restore();
          
        }else if(blocType == 'fill'){
          ctx.beginPath();
          ctx.moveTo(startPathX, startPathY);
          ctx.lineTo(point1X, point1Y);
          ctx.lineTo(point2X, point2Y);
          ctx.lineTo(point3X, point3Y);
          ctx.closePath();
          if(checkImage(this.color)){
            if(treeBg){
              ctx.fillStyle = treeBg;
              ctx.fill();
            }
            ctx.save();
            if(treeOpacity){
              ctx.globalAlpha = treeOpacity;
              
            }
            if(this.color.indexOf('tree') > 0){
              ctx.drawImage(this.image,this.x + 4,((this.y + this.height) - 98), 64, 96);
            }else if(this.color.indexOf('pillar') > 0){
              ctx.drawImage(this.image,this.x + 4,((this.y + this.height) - 126), 56, 128);
            }else if(this.color.indexOf('fence') > 0){
              ctx.drawImage(this.image,this.x + 20,((this.y + this.height) - 110), 48, 100);
            }else{
              ctx.drawImage(this.image,this.x + 6,((this.y + this.height) - 62), 62, 63);
            }
            ctx.restore();
          }else{
            ctx.fillStyle = this.color;
            ctx.fill();
          }
        }
      }
    }
  };

  this.newPos = function(){
    this.x += this.moveValX;
    this.y += this.moveValY;
    if(this.type == 'limit'){
      mooveFromLeft += this.moveValX;
      mooveFromTop += this.moveValY;
      // console.log(mooveFromLeft);
      // console.log(mooveFromTop);
    }
  };

  this.jumpPos = function(){
    this.y += this.movejumpValY;
  };

  // check if nigel'slice should be hidden by obstacle slice or not
  // set element z-index to 0 (nigel covers obstacle) or 1 (obstacle covers nigel)
  this.zIndexCheck = function(Nigel, newX, newY){
    var Nigeltop = Nigel.y;
    var NigelcenterY = Nigeltop + (Nigel.height / 2);
    var Obstacletop = this.y + Math.abs(newY);
    if(newY < 0){
      Obstacletop = this.y - Math.abs(newY);
    }
    var ObstaclecenterY = Obstacletop + (this.height / 2);
    if(NigelcenterY <= ObstaclecenterY){
      this.zIndex = 1;
    }else{
      this.zIndex = 0;
    }
  };

  // check if nigel's slice touches obstacle's slice
  // if outside -> blocked = false
  // if touches -> blocked = true
  this.collision = function(Nigel, newX, newY){
    var blocked = false;
    var Nigelleft = Nigel.x;
    var Nigelright = Nigel.x + Nigel.width;
    var Nigeltop = Nigel.y;
    var Nigelbottom = Nigel.y + Nigel.height;

    var NigelcenterX = Nigelleft + (Nigel.width / 2);
    var NigelcenterY = Nigeltop + (Nigel.height / 2);

    var point0 = [Nigelright,NigelcenterY];
    var point1 = [NigelcenterX,Nigelbottom];
    var point2 = [Nigelleft,NigelcenterY];
    var point3 = [NigelcenterX,Nigeltop];
    var NigelPoints = [point0, point1, point2, point3];

    var Obstacleleft = this.x + Math.abs(newX);
    if(newX < 0){
      Obstacleleft = this.x - Math.abs(newX);
    }
    var Obstacleright = Obstacleleft + this.width;
    var Obstacletop = this.y + Math.abs(newY);
    if(newY < 0){
      Obstacletop = this.y - Math.abs(newY);
    }
    var Obstaclebottom = Obstacletop + this.height;
    var ObstaclecenterX = Obstacleleft + (this.width / 2);
    var ObstaclecenterY = Obstacletop + (this.height / 2);

    var ObstacleShape = [[ObstaclecenterX, Obstacletop],[Obstacleright,ObstaclecenterY],[ObstaclecenterX,Obstaclebottom],[Obstacleleft,ObstaclecenterY]];
    if(inside(NigelPoints[0], ObstacleShape) || inside(NigelPoints[1], ObstacleShape) || inside(NigelPoints[2], ObstacleShape) || inside(NigelPoints[3], ObstacleShape)){
      blocked = true;
    }
    
    return blocked;
  };
 
  // think of another name !
  /*
  this.jumpableBounds = function(Nigel, newX, newY){
    var overing = false;
    this.overed = false;
    var Nigelleft = Nigel.x;
    var Nigelright = Nigel.x + Nigel.width;
    var Nigeltop = Nigel.y;
    var Nigelbottom = Nigel.y + Nigel.height;

    var NigelcenterX = Nigelleft + (Nigel.width / 2);
    var NigelcenterY = Nigeltop + (Nigel.height / 2);

    var point0 = [Nigelright,NigelcenterY];
    var point1 = [NigelcenterX,Nigelbottom];
    var point2 = [Nigelleft,NigelcenterY];
    var point3 = [NigelcenterX,Nigeltop];
    var NigelPoints = [point0, point1, point2, point3];

    var Obstacleleft = this.x + Math.abs(newX);
    if(newX < 0){
      Obstacleleft = this.x - Math.abs(newX);
    }
    var Obstacleright = Obstacleleft + this.width;
    var Obstacletop = this.y + Math.abs(newY);
    if(newY < 0){
      Obstacletop = this.y - Math.abs(newY);
    }
    var Obstaclebottom = Obstacletop + this.height;
    var ObstaclecenterX = Obstacleleft + (this.width / 2);
    var ObstaclecenterY = Obstacletop + (this.height / 2);

    var ObstacleShape = [[ObstaclecenterX, Obstacletop],[Obstacleright,ObstaclecenterY],[ObstaclecenterX,Obstaclebottom],[Obstacleleft,ObstaclecenterY]];
    // if(inside(NigelPoints[0], ObstacleShape) || inside(NigelPoints[1], ObstacleShape) || inside(NigelPoints[2], ObstacleShape) || inside(NigelPoints[3], ObstacleShape)){
    if(inside([NigelcenterX,NigelcenterY], ObstacleShape)){
      this.zIndex = 0;
      overing = this.level;
      this.overed = true;
    }else if(inside(NigelPoints[0], ObstacleShape) || inside(NigelPoints[1], ObstacleShape) || inside(NigelPoints[2], ObstacleShape) || inside(NigelPoints[3], ObstacleShape)){
      this.overed = false;
    }
    return overing;
  };
  */

  // check if the next moove of Nigel is outside the limits of the stage
  // compared to GameBorder
  // can't go outside the GameBorder zone
  this.bounds = function(Nigel, newX, newY){
    var blocked = false;
    var Nigelleft = Nigel.x;
    var Nigelright = Nigel.x + Nigel.width;
    var Nigeltop = Nigel.y;
    var Nigelbottom = Nigel.y + Nigel.height;

    var NigelcenterX = Nigelleft + (Nigel.width / 2);
    var NigelcenterY = Nigeltop + (Nigel.height / 2);

    var point1 = [Nigelright,NigelcenterY];
    var point2 = [NigelcenterX,Nigelbottom];
    var point3 = [Nigelleft,NigelcenterY];
    var point4 = [NigelcenterX,Nigeltop];
    var NigelPoints = [point1, point2, point3, point4];
    
    var obstaclePoint1X = this.x + Math.abs(newX);
    if(newX < 0){
      obstaclePoint1X = this.x - Math.abs(newX);
    }
    var obstaclePoint1Y = this.y + Math.abs(newY);
    if(newY < 0){
      obstaclePoint1Y = this.y - Math.abs(newY);
    }

    var firstPointX = obstaclePoint1X + this.coords[0][0];
    var firstPointY = obstaclePoint1Y + this.coords[0][1];
    
    var border = [[firstPointX, firstPointY]];
    for(var i = 1; i < this.coords.length; i++){
      border.push([obstaclePoint1X + this.coords[i][0], obstaclePoint1Y + this.coords[i][1]]);
    }
    if(!inside(NigelPoints[0], border) || !inside(NigelPoints[1], border) || !inside(NigelPoints[2], border) || !inside(NigelPoints[3], border)){blocked = true;}

    return blocked;
  };
  
  // check if the next moove of Nigel is inside a message zone
  // compared to GameBorder
  // can go inside the GameBorder zone
  this.checkDoor = function(Nigel, newX, newY){
    var blocked = false;
    
    var Nigelleft = Nigel.x;
    var Nigelright = Nigel.x + Nigel.width;
    var Nigeltop = Nigel.y;
    var Nigelbottom = Nigel.y + Nigel.height;

    var NigelcenterX = Nigelleft + (Nigel.width / 2);
    var NigelcenterY = Nigeltop + (Nigel.height / 2);

    var point1 = [Nigelright,NigelcenterY];
    var point2 = [NigelcenterX,Nigelbottom];
    var point3 = [Nigelleft,NigelcenterY];
    var point4 = [NigelcenterX,Nigeltop];
    var NigelPoints = [point1, point2, point3, point4];
    
    var obstaclePoint1X = this.x + Math.abs(newX);
    if(newX < 0){
      obstaclePoint1X = this.x - Math.abs(newX);
    }
    var obstaclePoint1Y = this.y + Math.abs(newY);
    if(newY < 0){
      obstaclePoint1Y = this.y - Math.abs(newY);
    }

    var firstPointX = obstaclePoint1X + this.coords[0][0];
    var firstPointY = obstaclePoint1Y + this.coords[0][1];
    
    var exit = [[firstPointX, firstPointY]];
    for(var i = 1; i < this.coords.length; i++){
      exit.push([obstaclePoint1X + this.coords[i][0], obstaclePoint1Y + this.coords[i][1]]);
    }
    if(inside(NigelPoints[0], exit) || inside(NigelPoints[1], exit) || inside(NigelPoints[2], exit) || inside(NigelPoints[3], exit)){blocked = true;}

    return blocked;
  };
  
  this.MessageZone = function(){
    let goTo = this.doAction;
    location.hash = goTo;
  };

  // show message
  this.throwMessage = function(){
    this.opened = true;
    var ctx = GameArea.context;
    var maxBoxWidth = 200;
    var maxBoxHeight = 100;

    if(boxWidth < maxBoxWidth){
      boxWidth += maxBoxWidth;
    }else{
      boxWidth = maxBoxWidth;
      endedX = true;
    }
    if(boxHeight < maxBoxHeight){
      boxHeight += 10;
    }else{
      boxHeight = maxBoxHeight;
      endedY = true;
    }
    var borderLineWidth = 3;
    var boxLeft = Nigel.x - (boxWidth / 2) + (Nigel.width / 2);
    var boxTop = NigelSlice.y - 64;
    ctx.save();
    ctx.fillStyle = "#3f2080";
    ctx.fillRect(0, canvas.height - boxHeight, canvas.width, boxHeight);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth   = borderLineWidth;
    ctx.strokeRect(borderLineWidth, canvas.height - boxHeight, canvas.width - (borderLineWidth * 2), boxHeight - borderLineWidth);
    
    if(endedX === true && endedY === true){
      ctx.fillStyle = "white";
      ctx.font = "18px 'Press Start 2P'";
      ctx.fillText(this.doAction, 20, canvas.height - boxHeight + 30);
    }
    ctx.restore();
    closeX = false;
    closeY = false;
  }
  
  // erase message
  this.eraseMessage = function(){
    if(this.opened === true){
      endedX = false;
      endedY = false;
      
      var ctx = GameArea.context;

      if(boxWidth > 0){
        boxWidth = 0;
      }else{
        boxWidth = 0;
        closeX = true;
      }
      if(boxHeight > 0){
        boxHeight -= 10;
      }else{
        boxHeight = 0;
        closeY = true;
      }

      if(closeX === true && closeY === true){
        this.opened = false;
      }else{
        var boxLeft = Nigel.x - (boxWidth / 2) + (Nigel.width / 2);
        var boxTop = NigelSlice.y - 64;
        ctx.save();
        ctx.fillStyle = "#3f2080";
        ctx.fillRect(0, canvas.height - boxHeight, canvas.width, boxHeight);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth   = 3;
        ctx.strokeRect(3, canvas.height - boxHeight, canvas.width - 6, boxHeight - 3);
        ctx.restore();
      }
    }
  }
};

// stop movement (last direction)
function stopMove(direction){
  GameArea.keys[direction] = false; 
  if(!GameArea.keys[goRight] && !GameArea.keys[goLeft] && !GameArea.keys[goUp] && !GameArea.keys[goDown]){
    isMoving = false;
    canMoveRightBottom = false;
    canMoveRightUp = false;
    canMoveLeftBottom = false;
    canMoveLeftUp = false;
  }
  canMove = true;
}

// allow move (direction)
function movingTo(direction){
  GameArea.keys = (GameArea.keys || []);
  if(direction == jump){
    if(!isjumping && !isfalling){
      isjumping = true;
      isfalling = false;
      setTimeout(function(){
        if(isjumping && !isfalling){
          isjumping = false;
          isfalling = true;
          setTimeout(function(){
            if(!isjumping && isfalling){
              isjumping = false;
              isfalling = false;
            }
          }, 200);
        }
      }, 200);
    }
  }else{
    GameArea.keys[direction] = true;
    isMoving = true;
    canMoveRightBottom = true;
    canMoveRightUp = true;
    canMoveLeftBottom = true;
    canMoveLeftUp = true;
  }
}



function updateGameArea(){
  GameArea.clear();
  var movetoX = 0;
  var movetoY = 0;

  var movingX = NigelSlice.dirX;
  var movingY = NigelSlice.dirY;
  
  if(GameArea.keys){
    if(GameArea.keys[goRight] || GameArea.keys[goLeft] || GameArea.keys[goUp] || GameArea.keys[goDown]){
      if(GameArea.keys[goRight] && GameArea.keys[goDown]){
        movingX = 'right';
        movingY = 'bottom';
      }else if(GameArea.keys[goRight] && GameArea.keys[goUp]){
        movingX = 'right';
        movingY = 'up';
      }else if(GameArea.keys[goLeft] && GameArea.keys[goDown]){
        movingX = 'left';
        movingY = 'bottom';
      }else if(GameArea.keys[goLeft] && GameArea.keys[goUp]){
        movingX = 'left';
        movingY = 'up';
      }else if(GameArea.keys[goDown]){
        movingX = 'right';
        movingY = 'bottom';
      }else if(GameArea.keys[goRight]){
        movingX = 'right';
        movingY = 'up';
      }else if(GameArea.keys[goLeft]){
        movingX = 'left';
        movingY = 'bottom';
      }else if(GameArea.keys[goUp]){
        movingX = 'left';
        movingY = 'up';
      }
      isMoving = true;
    }else{
      isMoving = false;
    }
  }

  movetoX = moveValX;
  if(movingX == 'right'){
    movetoX = - moveValX;
  }
  movetoY = moveValY;
  if(movingY == 'bottom'){
    movetoY = - moveValY;
  }
  

  if(GameBorder.bounds(Nigel, movetoX, movetoY)){
    if(movingX == 'right' && movingY == 'bottom'){
      canMoveRightBottom = false;
    }else if(movingX == 'right' && movingY == 'up'){
      canMoveRightUp = false;
    }else if(movingX == 'left' && movingY == 'bottom'){
      canMoveLeftBottom = false;
    }else if(movingX == 'left' && movingY == 'up'){
      canMoveLeftUp = false;
    }
  }
  
  for(var i = 0; i < Obstacles.length; i ++){
    Obstacles[i].zIndexCheck(Nigel, movetoX, movetoY);
    //if(Obstacles[i].level === false){
      if(Obstacles[i].collision(Nigel, movetoX, movetoY)){
        if(movingX == 'right' && movingY == 'bottom'){
          canMoveRightBottom = false;
        }else if(movingX == 'right' && movingY == 'up'){
          canMoveRightUp = false;
        }else if(movingX == 'left' && movingY == 'bottom'){
          canMoveLeftBottom = false;
        }else if(movingX == 'left' && movingY == 'up'){
          canMoveLeftUp = false;
        }
      }
    //}else if(Obstacles[i].level > 0){
      //Obstacles[i].jumpableBounds(Nigel, movetoX, movetoY);
    //}
  }
  for(var i = 0; i < Deco.length; i ++){
    Deco[i].zIndexCheck(Nigel, movetoX, movetoY);
  }
  
  // check if nigel is moving
  var checkMoving = function(){
    if((movingX == 'right' && movingY == 'bottom' && canMoveRightBottom) || (movingX == 'right' && movingY == 'up' && canMoveRightUp) || (movingX == 'left' && movingY == 'bottom' && canMoveLeftBottom) || (movingX == 'left' && movingY == 'up' && canMoveLeftUp)){return true;}else{return false;}
  };

  if(checkMoving()){
    GameBackground.moveValX = movetoX;
    GameBackground.moveValY = movetoY;
    GameBorder.moveValX = movetoX;
    GameBorder.moveValY = movetoY;
  }else{
    GameBackground.moveValX = 0;
    GameBackground.moveValY = 0;
    GameBorder.moveValX = 0;
    GameBorder.moveValY = 0;
  }

  GameBackground.newPos();
  GameBackground.update();
  GameBorder.newPos();
  GameBorder.update();

  for(var i = 0; i < MessageZone.length; i ++){
    if(checkMoving()){
      MessageZone[i].moveValX = movetoX;
      MessageZone[i].moveValY = movetoY;
    }else{
      MessageZone[i].moveValX = 0;
      MessageZone[i].moveValY = 0;
    }
    MessageZone[i].newPos();
    MessageZone[i].update();
  }

  for(var i = 0; i < ExitZone.length; i ++){
    if(checkMoving()){
      ExitZone[i].moveValX = movetoX;
      ExitZone[i].moveValY = movetoY;
    }else{
      ExitZone[i].moveValX = 0;
      ExitZone[i].moveValY = 0;
    }
    ExitZone[i].newPos();
    ExitZone[i].update();
  }
  
  
  if(everyinterval(animInterval)){
    for(var i = 0; i < Obstacles.length; i ++){
      if(Obstacles[i].zIndex == 0){
        if(checkMoving()){
          Obstacles[i].moveValX = movetoX;
          Obstacles[i].moveValY = movetoY;
        }else{
          Obstacles[i].moveValX = 0;
          Obstacles[i].moveValY = 0;
        }
        Obstacles[i].newPos();
        Obstacles[i].update();
      }
    }
    for(var i = 0; i < Deco.length; i ++){
      if(Deco[i].zIndex == 0){
        if(checkMoving()){
          Deco[i].moveValX = movetoX;
          Deco[i].moveValY = movetoY;
        }else{
          Deco[i].moveValX = 0;
          Deco[i].moveValY = 0;
        }
        Deco[i].newPos();
        Deco[i].update();
      }
    }
    
  }else{
    for(var i = 0; i < Obstacles.length; i ++){
      if(Obstacles[i].zIndex == 0){
        if(checkMoving()){
          Obstacles[i].moveValX = movetoX;
          Obstacles[i].moveValY = movetoY;
        }else{
          Obstacles[i].moveValX = 0;
          Obstacles[i].moveValY = 0;
        }
        Obstacles[i].newPos();
        Obstacles[i].update();
      }
    }
    for(var i = 0; i < Deco.length; i ++){
      if(Deco[i].zIndex == 0){
        if(checkMoving()){
          Deco[i].moveValX = movetoX;
          Deco[i].moveValY = movetoY;
        }else{
          Deco[i].moveValX = 0;
          Deco[i].moveValY = 0;
        }
        Deco[i].newPos();
        Deco[i].update();
      }
    }
  }

  // animate nigel image slice
  if(isjumping){
    NigelSlice.moveSlide = 0;
    NigelSlice.action = 'jump';
    if(movingX == 'right' && movingY == 'up'){
      NigelSlice.sliceTop = 5;
      NigelSlice.sliceLeft = 0;
    }else if(movingX == 'left' && movingY == 'up'){
      NigelSlice.sliceTop = 6;
      NigelSlice.sliceLeft = 0;
    }else if(movingX == 'left' && movingY == 'bottom'){
      NigelSlice.sliceTop = 7;
      NigelSlice.sliceLeft = 0;
    }else if(movingX == 'right' && movingY == 'bottom'){
      NigelSlice.sliceTop = 8;
      NigelSlice.sliceLeft = 0;
    }
  }else if(isfalling){
    NigelSlice.moveSlide = 0;
    NigelSlice.action = 'fall';
    if(movingX == 'right' && movingY == 'up'){
      NigelSlice.sliceTop = 5;
      NigelSlice.sliceLeft = 1;
    }else if(movingX == 'left' && movingY == 'up'){
      NigelSlice.sliceTop = 6;
      NigelSlice.sliceLeft = 1;
    }else if(movingX == 'left' && movingY == 'bottom'){
      NigelSlice.sliceTop = 7;
      NigelSlice.sliceLeft = 1;
    }else if(movingX == 'right' && movingY == 'bottom'){
      NigelSlice.sliceTop = 8;
      NigelSlice.sliceLeft = 1;
    }
  }else{
    if(isMoving){
      NigelSlice.action = 'walk';
      if(movingX == 'right' && movingY == 'up'){
        NigelSlice.sliceTop = 1;
        NigelSlice.sliceLeft = 0;
      }else if(movingX == 'left' && movingY == 'up'){
        NigelSlice.sliceTop = 2;
        NigelSlice.sliceLeft = 0;
      }else if(movingX == 'left' && movingY == 'bottom'){
        NigelSlice.sliceTop = 3;
        NigelSlice.sliceLeft = 0;
      }else if(movingX == 'right' && movingY == 'bottom'){
        NigelSlice.sliceTop = 4;
        NigelSlice.sliceLeft = 0;
      }
    }else{
      NigelSlice.moveSlide = 0;
      NigelSlice.action = 'wait';
      if(movingX == 'right' && movingY == 'bottom'){
        NigelSlice.sliceTop = 0;
        NigelSlice.sliceLeft = 0;
      }else if(movingX == 'right' && movingY == 'up'){
        NigelSlice.sliceTop = 0;
        NigelSlice.sliceLeft = 1;
      }else if(movingX == 'left' && movingY == 'bottom'){
        NigelSlice.sliceTop = 0;
        NigelSlice.sliceLeft = 3;
      }else if(movingX == 'left' && movingY == 'up'){
        NigelSlice.sliceTop = 0;
        NigelSlice.sliceLeft = 2;
      }
    }
  }

  Nigel.update();

  GameArea.frameNo += 1;
  if(everyinterval(animInterval)){
    NigelSlice.dirX = movingX;
    NigelSlice.dirY = movingY;
    if(!isjumping && !isfalling){
      if(isMoving){
        if(NigelSlice.moveSlide +1 >= NigelSlice.sliceColls){
          NigelSlice.moveSlide = 0;
        }else{
          // NigelSlice.moveSlide += 1;
          NigelSlice.moveSlide += 1;
        }
      }
    }
    NigelSlice.update();

    
    for(var i = 0; i < Obstacles.length; i ++){
      if(Obstacles[i].zIndex > 0){
        if(checkMoving()){
          Obstacles[i].moveValX = movetoX;
          Obstacles[i].moveValY = movetoY;
        }else{
          Obstacles[i].moveValX = 0;
          Obstacles[i].moveValY = 0;
        }
        Obstacles[i].newPos();
        Obstacles[i].update();
      }
    }
    for(var i = 0; i < Deco.length; i ++){
      if(Deco[i].zIndex > 0){
        if(checkMoving()){
          Deco[i].moveValX = movetoX;
          Deco[i].moveValY = movetoY;
        }else{
          Deco[i].moveValX = 0;
          Deco[i].moveValY = 0;
        }
        Deco[i].newPos();
        Deco[i].update();
      }
    }
  }else{
    NigelSlice.update();
    
    for(var i = 0; i < Obstacles.length; i ++){
      if(Obstacles[i].zIndex > 0){
        if(checkMoving()){
          Obstacles[i].moveValX = movetoX;
          Obstacles[i].moveValY = movetoY;
        }else{
          Obstacles[i].moveValX = 0;
          Obstacles[i].moveValY = 0;
        }
        Obstacles[i].newPos();
        Obstacles[i].update();
      }
    }
    
    for(var i = 0; i < Deco.length; i ++){
      if(Deco[i].zIndex > 0){
        if(checkMoving()){
          Deco[i].moveValX = movetoX;
          Deco[i].moveValY = movetoY;
        }else{
          Deco[i].moveValX = 0;
          Deco[i].moveValY = 0;
        }
        Deco[i].newPos();
        Deco[i].update();
      }
    }
  }
  
  for(let i = 0; i < MessageZone.length; i ++){
    if(MessageZone[i].checkDoor(Nigel, movetoX, movetoY)){
      MessageZone[i].throwMessage();
    }else{
      MessageZone[i].eraseMessage();
    }
  }

  for(let i = 0; i < ExitZone.length; i ++){
    if(ExitZone[i].checkDoor(Nigel, movetoX, movetoY)){
      ExitZone[i].MessageZone();
    }
  }
}

var updatePosForJump = function(val, allElements){
  if(allElements){
    GameBackground.movejumpValY = val;
    GameBackground.jumpPos();
    GameBackground.update();
    
    GameBorder.movejumpValY = val;
    GameBorder.jumpPos();
    GameBorder.update();

    for(var i = 0; i < MessageZone.length; i ++){
      MessageZone[i].movejumpValY = val;
      MessageZone[i].jumpPos();
      MessageZone[i].update();
    }

    for(var i = 0; i < ExitZone.length; i ++){
      ExitZone[i].movejumpValY = val;
      ExitZone[i].jumpPos();
      ExitZone[i].update();
    }
    
    for(var i = 0; i < Obstacles.length; i ++){
      if(Obstacles[i].zIndex == 0){
        Obstacles[i].movejumpValY = val;
        Obstacles[i].jumpPos();
        Obstacles[i].update();
      }
    }
    for(var i = 0; i < Deco.length; i ++){
      if(Deco[i].zIndex == 0){
        Deco[i].movejumpValY = val;
        Deco[i].jumpPos();
        Deco[i].update();
      }
    }

    Nigel.moveValX = 0;
    Nigel.moveValY = val;
    Nigel.newPos();
    Nigel.update();

    NigelSlice.update();

    for(var i = 0; i < Obstacles.length; i ++){
      if(Obstacles[i].zIndex > 0){
        Obstacles[i].movejumpValY = val;
        Obstacles[i].jumpPos();
        Obstacles[i].update();
      }
    }
    for(var i = 0; i < Deco.length; i ++){
      if(Deco[i].zIndex > 0){
        Deco[i].movejumpValY = val;
        Deco[i].jumpPos();
        Deco[i].update();
      }
    }
  }else{
    Nigel.moveValY = val;
    Nigel.newPos();
    Nigel.update();

    NigelSlice.update();
  }
}


function everyinterval(n){
  if((GameArea.frameNo / n) % 1 == 0){
    return true;
  }else{
    return false;
  }
}

startGame();


(function gameLoop(){
  frameLoop(gameLoop);
  updateGameArea();
})();