 var KEY            = { ESC: 27, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 , R: 82},
      DIR           = { UP: 0, DOWN: 1, LEFT: 2, RIGHT: 3, OPPOSITE: [1, 0, 3, 2] },
      canvas        = document.getElementById('snakeBoard'),
      width         = canvas.width  = canvas.offsetWidth,
      height        = canvas.height = canvas.offsetHeight,
      ctx           = canvas.getContext('2d'),
      nx            = 50,
      ny            = 50,
      dy            = height / ny,
      dx            = width / nx,
      playing       = false,
      startX        = nx / 2,
      startY        = ny / 2,
      snakeSpeed    = 0.1,
      indent        = 10,
      foodAmount    = 1,
      startLen      = 5,
      growthAmount  = 5,
      currentFoodAmount,
      dstep, dt, length, moves, dir, growth, head, tail,foods;


      //Document vars 
 var upgrades,
      food                 = 0;
      totalFood            = 100,
	  costs                = [],
	  amounts              = [],
	  highScore   		   = 0,

 	  upgradeDiv           = document.getElementById("upgrades"),
      
      totalFoodDisplay     = document.createElement("h4"),
      totalFoodDisplayText = document.createTextNode("Total food: ");

 	  score                = document.createElement("p"),
 	  scoreText            = document.createTextNode("Food this run: " + food);

 	  highScoreDisplay     = document.createElement("p"),
 	  highScoreDisplayText = document.createTextNode("HighScore: " + 0);

  function play() { reset(); playing = true};
  function lose() {          playing = false; };

  function reset() {
    dstep  = snakeSpeed,
    dt     = 0;
    moves  = [];
    dir    = DIR.LEFT;
    head   = tail = { x: getStartX(), y: getStartY()};
    length = 1;
    food   = 0;

    updateScore();

    growth            = startLen;
    foods             = [];
    currentFoodAmount = 0;

    while(--growth)
      increase();

  	i = foodAmount;

  	while(i-- && (currentFoodAmount + length + 1 + totalDarkSpace()<= nx  * ny)){
    	foods.push(unoccupied());
    	currentFoodAmount++;
	}
	
  };


  function update(idt) {
    if (playing) {
      dt = dt + idt;
      if (dt > dstep) {
        dt = dt - dstep;
        increase(moves.shift());
        decrease();

        if (snakeOccupies(head, true) || ((head.x == indent - 1|| head.x == nx - indent || head.y == ny - indent|| head.y == indent - 1) && indent != 0)) {
          lose();
        }
        else if (foodOccupies(head)) {

          growth += growthAmount;
          food++;
          totalFood++;
          currentFoodAmount--;

          updateScore();

          if((currentFoodAmount + length + 1 + totalDarkSpace()<= nx  * ny)){
          	foods.push(unoccupied());
          	currentFoodAmount++;
          }
        }
      }
    }
  };

  function getStartX(){
  	return Math.round(random(nx/4 + indent, 3 * nx / 4 - indent));
  };

  function getStartY(){
  	return Math.round(random(ny/4 + indent, 3 * ny / 4 - indent));
  };

  function totalDarkSpace() {
  	var int = nx * ny;
  	int -= (nx - indent * 2)**2;
	return int;
  };

  function updateScore(){
  	score.innerHTML = "Food this run: " + food;
  	totalFoodDisplay.innerHTML = "Total food: " + totalFood;
  	if(food > highScore){
  		highScore = food;
  		highScoreDisplay.innerHTML = "HighScore: " + highScore;
  	}
  }

  function updateCosts(id){
  	console.log(upgrades[id]);
  	if(upgrades[id].max){
  		costs[id].innerHTML = "Maxed";
  		amounts[id].innerHTML = upgrades[id].name + " (Max)";
  		return;
  	}
  	amounts[id].innerHTML = upgrades[id].name + " (" + upgrades[id].curent + ")";
  	costs[id].innerHTML = upgrades[id].cost;
  }

  function draw(ctx) {
    ctx.globalAlpha = playing ? 1.0 : 0.5;
    ctx.fillStyle = '#522A27';
    ctx.fillRect(0,0, width, height);
    ctx.fillStyle = '#EABA6B';
    ctx.fillRect(dx * indent, dy * indent, width - dx * indent * 2, height - dy * 2 * indent);
    ctx.fillStyle = 'green';
    var i;
	for(i = 0; i < foods.length; i++){
   		ctx.fillRect(foods[i].x * dx, foods[i].y * dy, dx, dy);
	}
    ctx.fillStyle = '#522A27';
    ctx.fillRect(head.x * dx, head.y * dy, dx, dy);
    ctx.fillStyle = '#1080F0';
    ctx.fillRect(head.x * dx + 1, head.y* dy + 1, dx -2, dy-2);
    var segment = head, n = 0;
    while(segment = segment.next) {
      ctx.fillStyle = '#1080F0';
      ctx.fillRect(segment.x * dx + 1, segment.y * dy + 1, dx - 2, dy - 2);
    }
  };

  function push(segment) {
    length++;
    if (head) {
      head.prev = segment;
      segment.next = head;
    }
    head = segment;
  };

  function pop() {
    length--;
    if (tail.prev) {
      tail = tail.prev;
      tail.next = null;
    }
  };

  function increase(changeDir) {
    dir  = (typeof changeDir != 'undefined') ? changeDir : dir;
    if(indent != 0){
	    switch(dir) {
	      case DIR.LEFT:  push({x: head.x-1, y: head.y}); break;
	      case DIR.RIGHT: push({x: head.x+1, y: head.y}); break;
	      case DIR.UP:    push({x: head.x, y: head.y-1 }); break;
	      case DIR.DOWN:  push({x: head.x, y:head.y+1 }); break;
	    }
	} else{
		switch(dir) {
	      case DIR.LEFT:  push({x: (head.x <= 0) ?    nx : head.x-1, y: head.y});                            break;
	      case DIR.RIGHT: push({x: (head.x >= nx -1) ? 0 : head.x+1, y: head.y});                            break;
	      case DIR.UP:    push({x: head.x,                           y: (head.y <= 0) ? ny : head.y-1});     break;
	      case DIR.DOWN:  push({x: head.x,                           y: (head.y >= ny - 1) ? 0 : head.y+1}); break;
	    }
  	}
  };

  function decrease() {
    if (growth)
      growth--;
    else
      pop();
  };

  function move(where) {
    var previous = moves.length ? moves[moves.length-1] : dir;
    if ((where != previous) && (where != DIR.OPPOSITE[previous]))
      moves.push(where);
  };

  function onkeydown(ev) {
    var handled = false;
    if (playing) {
      switch(ev.keyCode) {
        case KEY.LEFT:   move(DIR.LEFT);  handled = true; break;
        case KEY.RIGHT:  move(DIR.RIGHT); handled = true; break;
        case KEY.UP:     move(DIR.UP);    handled = true; break;
        case KEY.DOWN:   move(DIR.DOWN);  handled = true; break;
        case KEY.R: 	 reset();  		  handled = true; break;
        case KEY.ESC:    lose();          handled = true; break;
        case KEY.SPACE:                   handled = true; break;
      }
    }
    else if (ev.keyCode == KEY.SPACE) {
      play();
      handled = true;
  	}
    if (handled)
      ev.preventDefault(); 
  };

  function foodOccupies(pos, noDelete) {
  	var i;
  	for(i = 0; i < foods.length; i++){
   		if(occupies(foods[i], pos)){
   			if(!noDelete)foods.splice(i, 1);
   			return true;
   			break;
   		}
  	}
  };

  function snakeOccupies(pos, ignoreHead) {
    var segment = ignoreHead ? head.next : head;
    //if(segment.x < 1 || segment.x > nx -1 || segment.y < 1 || segment.y > ny-1) return true;
    do {
      if (occupies(segment, pos))
        return true;
    } while (segment = segment.next);

    return false;
  };

  function unoccupied() {
    var pos = {};
    do {
      pos.x = Math.round(random(indent, nx- 1 - indent));
      pos.y = Math.round(random(indent, ny- 1 - indent));
    } while (snakeOccupies(pos) || foodOccupies(pos, true));
    return pos;
  };

  function occupies(a, b)   { return a && b && (a.x == b.x) && (a.y == b.y); };
  function timestamp()      { return new Date().getTime();                   };
  function random(min, max) { return (min + (Math.random() * (max - min)));  };

  document.addEventListener('keydown', onkeydown, false);
  document.addEventListener('mousedown', function(e){e.preventDefault();}, false);

  function init(){

  	score.appendChild(scoreText);
  	document.getElementById("snake").appendChild(score);

  	highScoreDisplay.appendChild(highScoreDisplayText);
  	document.getElementById("snake").appendChild(highScoreDisplay);

  	totalFoodDisplay.appendChild(totalFoodDisplayText);
  	document.getElementById("upgrades").appendChild(totalFoodDisplay);

  	upgrades = [
  		{
  			name: "Area",
  			cost: 0,
  			id: 0,
  			limit: indent,
  			curent: 0,
  			max: false,
  			effect: function(){
  				console.log(this.name + " clicked, " + totalFood + ", " + this.cost);
	  			if(totalFood >= this.cost && !playing && !this.max){
	  				indent--;
	  				totalFood -= this.cost;
	  				this.curent++;
	  				this.cost += 0;
	  				if(this.curent >= this.limit) this.max = true;
	  				reset();
	  				updateCosts(this.id);
	  				updateScore();
	  			}
  			}
		},
  		{
  			name: "Speed",
  			cost: 0,
  			id: 1,
  			limit: 20,
  			curent: 0,
  			max: false,
  			effect: function(){
  				console.log(this.name + " clicked, " + totalFood + ", " + this.cost);
	  			if(totalFood >= this.cost && !playing && !this.max){
	  				snakeSpeed -= 0.01;
	  				totalFood -= this.cost;
	  				this.curent++;
	  				this.cost += 0;
	  				if(this.curent >= this.limit) this.max = true;
	  				reset();
	  				updateCosts(this.id);
	  				updateScore();
	  			}
  			}
  		},
  		{
  			name: "Food",
  			cost: 0,
  			id: 2,
  			limit: 100,
  			curent: 0,
  			max: false,
  			effect: function(){
  				console.log(this.name + " clicked, " + totalFood + ", " + this.cost);
	  			if(totalFood >= this.cost && !playing && !this.max){
	  				foodAmount += 100;
	  				totalFood -= this.cost;
	  				this.curent++;
	  				this.cost = 0;
	  				if(this.curent >= this.limit) this.max = true;
	  				reset();
	  				updateCosts(this.id);
	  				updateScore();
	  			}
  			}
  		},
  		{
  			name: "Growth",
  			cost: 0,
  			id: 3,
  			limit: 5,
  			curent: 0,
  			max: false,
  			effect: function(){
  				console.log(this.name + " clicked, " + totalFood + ", " + this.cost);
	  			if(totalFood >= this.cost && !playing && !this.max){
	  				growthAmount--;
	  				totalFood -= this.cost;
	  				this.curent++;
	  				this.cost = 0;
	  				if(this.curent >= this.limit) this.max = true;
	  				reset();
	  				updateCosts(this.id);
	  				updateScore();
	  			}
  			}
  		}
  	];
  	costs = [];
  	var i = 0;
  	while(i < upgrades.length){
  		var b = document.createElement("div"),
  			a = document.createElement("p"),
  			c = document.createElement("p");

  		a.innerHTML = upgrades[i].name + " (" + 0 + ")";
  		c.innerHTML = upgrades[i].cost;
  		b.style.width = "100%";	

  		b.object = upgrades[i];
  		b.onclick = function(o) {
  			return function(){
  				o.effect();
  			}
  		}(upgrades[i]);

  		costs.push(c);
  		amounts.push(a);
  		b.appendChild(a);
  		b.appendChild(c);

  		document.getElementById("upgrades").appendChild(b);
  		a.style.float = "left";
  		c.style.float = "right";
  		i++;							
  	}
   	
  }

  var start, last = timestamp();
  function frame() {
    start = timestamp();
    update((start - last) / 1000.0);
    draw(ctx);
    last = start;
    setTimeout(frame, 1);
  }
  
  init();
  reset();
  frame();
