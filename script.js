// canvas for drawing into
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

//canvas for map
var bgcanvas = document.createElement('canvas');
var bgctx = bgcanvas.getContext('2d');

//buttons
var btnSave = document.getElementById("save"); 
var btnLoad = document.getElementById("load");
var btnClear = document.getElementById("clear");
var btnBack = document.getElementById("back");

var slider = document.getElementById("strokewidth");

var pencolor = document.getElementById("pencolor");
var addwaypoint = document.getElementById("addwaypoint");

//Initial page setup
document.body.appendChild(bgcanvas);
document.body.appendChild(canvas);

//json with the information of current map
var map_info = JSON.parse("{}");

//map names for adition
var map_names = [];

//history, for going back
var prevs = [];
var current = -1;

pen_color = "#FFFFFF";
stroke_width = 10;

//boundaries for drawing
maxX = 0;
maxY = 0;

//add listeners - interrupts?
document.addEventListener('mousemove', draw);
document.addEventListener('mousedown', setPosition);
document.addEventListener('mouseenter', setPosition);


// last known position
var pos = { x: 0, y: 0 };


//get initial info
$.ajax(
{
	async: false,
	type: 'POST',
	url: 'http://0.0.0.0:8000/init.php',
	success: function(data)
	{
		console.log("Initial setup...")
		//get info about entry point AKA main map
		map_info = JSON.parse(data);
		//update history
		prevs.push(map_info.name);
		current++;
		console.info(prevs);
		console.log(current);
		//if there is something drawn, draw it. In either case, log it.
		if(map_info.canvas != "")
		{
			console.log("Starting to restore the drawing...");
			var saved_ctx = new Image();
			saved_ctx.src = map_info.canvas;
			saved_ctx.onload = function()
			{
				var ratio = saved_ctx.height/saved_ctx.width;
				canvas.width = window.innerHeight/ratio;
				canvas.height = window.innerHeight;
				ctx.drawImage(saved_ctx, 0,0,window.innerHeight/ratio,window.innerHeight);
			    ctx.stroke();

			    map_info.buttons.forEach(record => 
			    {
			    	console.log(record);
					var waybutt = document.createElement("button");
					waybutt.setAttribute("class", "waybutt");
					waybutt.setAttribute("id", record.id);
					waybutt.style.left = Math.round(record.left*parseInt(canvas.width))+"px";
					waybutt.style.top = Math.round(record.top*parseInt(canvas.height))+"px";
					console.log(record.top);//*parseInt(canvas.height)+"px");
					waybutt.style.width = "50px";
				  	waybutt.style.height = "50px";
				  	waybutt.value = record.map;
				  	waybutt.onclick = function() {

				  		save();
				  		load(waybutt.value);
				  	}
					document.body.appendChild(waybutt);
				})
			}
			console.log("Restoration done");
		}
		else
		{
			console.log("No saved drawing present.")
		}

        //set the map AKA background
		var img = new Image();
		img.src = map_info.name;
		img.onload = function()
		{
			var ratio = img.height/img.width;
			bgcanvas.width = window.innerHeight/ratio;
			bgcanvas.height = window.innerHeight;
			//if there is no drawing saved, set the initial size of drawing canvas as well
			if(map_info.canvas == "")
			{
				canvas.width = window.innerHeight/ratio;
				canvas.height = window.innerHeight;
			}
			maxX = window.innerHeight/ratio;
			maxY =  window.innerHeight;
		    bgctx.drawImage(img,0,0,window.innerHeight/ratio,window.innerHeight );   
		    bgctx.stroke(); // draw it!
		}
		
		

	}
});

//get map names in case of waypoint adition
get_map_names();

function unload_prev_buttons()
{
document.querySelectorAll('.waybutt').forEach(e => e.remove());
}

pencolor.addEventListener('input', () =>{
pen_color = pencolor.value;
});

slider.addEventListener("input", () => {
	stroke_width = slider.value;
});

function load(map)
{
	unload_prev_buttons();

	console.log("Map to load:" + map);
	var xhr = new XMLHttpRequest();
	var url = "http://0.0.0.0:8000/load.php";
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onload = function () 
	{
		console.log("Loading new map...");
		//get info about entry point AKA main map
		map_info = JSON.parse(xhr.responseText);
		

		//update history
		console.log(prevs[current+1]);
		console.log(map_info.name);
		if(prevs[current+1] == map_info.name) // = prechazim na mapu, ze ktere jsem se vratil tlacitkem zpet
		{
			current++;
		} 
		else // jdu jinou cestou, musim popnout vsechny stare mapy
		{
			while(current+1 > prevs.lenght)
			{
			 	prevs.pop();
			}
			prevs.push(map_info.name);
			current++;
		}
		
		console.info(prevs);
		console.log(current);

		//if there is something drawn, draw it. In either case, log it.
		if(map_info.canvas != "")
		{
			console.log("Starting to restore the drawing...");
			var saved_ctx = new Image();
			saved_ctx.src = map_info.canvas;
			saved_ctx.onload = function()
			{
				var ratio = saved_ctx.height/saved_ctx.width;
				canvas.width = window.innerHeight/ratio;
				canvas.height = window.innerHeight;
				ctx.drawImage(saved_ctx, 0,0,window.innerHeight/ratio,window.innerHeight);
			    ctx.stroke();

			    map_info.buttons.forEach(record => 
			    {
			    	console.log(record);
					var waybutt = document.createElement("button");
					waybutt.setAttribute("class", "waybutt");
					waybutt.setAttribute("id", record.id);
					waybutt.style.left = Math.round(record.left*parseInt(canvas.width))+"px";
					waybutt.style.top = Math.round(record.top*parseInt(canvas.height))+"px";
					console.log(record.top);//*parseInt(canvas.height)+"px");
					waybutt.style.width = "50px";
				  	waybutt.style.height = "50px";
				  	waybutt.value = record.map;
				  	waybutt.onclick = function() {

				  		save();
				  		load(waybutt.value);
				  	}
					document.body.appendChild(waybutt);
				})
			}
			console.log("Restoration done");
		}
		else
		{
			console.log("No saved drawing present.")
		}

        //set the map AKA background
		var img = new Image();
		img.src = map_info.name;
		img.onload = function()
		{
			var ratio = img.height/img.width;
			bgcanvas.width = window.innerHeight/ratio;
			bgcanvas.height = window.innerHeight;
			//if there is no drawing saved, set the initial size of drawing canvas as well
			if(map_info.canvas == "")
			{
				canvas.width = window.innerHeight/ratio;
				canvas.height = window.innerHeight;
			}
			maxX = window.innerHeight/ratio;
			maxY =  window.innerHeight;
		    bgctx.drawImage(img,0,0,window.innerHeight/ratio,window.innerHeight );   
		    bgctx.stroke(); // draw it!
		}
		
		

	};

	var data = JSON.stringify({"id":map});
	xhr.send(data);

}









btnBack.onclick = function(){
	if (prevs.lenght <= 1) {
		return;
	}
	else
	{
		save();
		if(current > 0)
		{
			current -= 1 ;
		}
		else
		{
			return;
		}

		//pop myself
		console.log(prevs);
		//prevs.pop();
		//prev = prevs.pop();
		console.log("******PREV IS:");
		//console.log(prev);
		console.log(prevs);
		load(prevs[current]);
	}

	
}










addwaypoint.addEventListener('change', (event) => {
	var mapselectordiv = document.getElementById("mapselectordiv");
	
  if (event.currentTarget.checked) {
    mapselectordiv.style.display="block";
  } else {
    mapselectordiv.style.display="none";	
  }
})

btnClear.onclick = function()
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

btnLoad.onclick = function()
{

	//Nepotrebne(?)
}


btnSave.onclick = function()
{
	save();
}

// new position from mouse event
function setPosition(e)
{
	if (document.getElementById("addwaypoint").checked)
	{
		// >0 is because when selecting map from selectbox, cursor is at 0,0 for a while...
	  	if(e.clientX < maxX && e.clientY < maxY && e.clientY > 0 && e.clientX > 0)
	  	{
		  	//create new button
		  	var waybutt = document.createElement("button");

		  	//prepare json record for the waypoint
		  	var json_record = {};

		  	//get the map to which wypoint will be pointing
		  	var select = document.getElementById("mapselect");
		  	var map = select.value;

		  	//make the id unique and increment the counter
		  	var id = map_info.name + map_info.unique.toString();
		  	map_info.unique = map_info.unique + 1;
		  	waybutt.setAttribute("id", id);
		  	waybutt.setAttribute("class", "waybutt");
		  	waybutt.style.left = e.clientX-25+"px";
		  	waybutt.style.top = e.clientY-25+"px";
		  	waybutt.style.width = "50px";
		  	waybutt.style.height = "50px";


		  	json_record.id = id;
		  	//positions stored NOT as an absolute distance in px, but as a ratio to the canvas size
		  	// This hack should ensure +- fixed position of buttons when resizing the window
		  	json_record.left = parseInt(waybutt.style.left)/parseInt(canvas.width);
		  	json_record.top = parseInt(waybutt.style.top)/parseInt(canvas.height);
		  	json_record.map = map;
		  	
		  	//add the json record to the main one and save it:
		  	map_info.buttons.push(json_record);		  	
		  	document.body.appendChild(waybutt);
		  	save();
	 	  	//TODO otevřít okno, kde se vybere, kam to půjde.
	    }
	}
	  pos.x = e.clientX;
	  pos.y = e.clientY;
}



// Saves the current state
//TODO call when: save button clicked, waypoint activated, page reloaded
function save()
{
	//get current canvas state and update it in map_info json
	var canvas_state = canvas.toDataURL(); 
	map_info.canvas = canvas_state;	

	//start request
    var xhr = new XMLHttpRequest();
	var url = "http://0.0.0.0:8000/save.php";
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () 
	{
	    if (xhr.readyState === 4 && xhr.status === 200)
	    {
	      //  var json = JSON.parse(xhr.responseText);
	        console.log("State saved");
	    }
	    else
	    {
	    	console.log("Something happened:");
	    	console.log(xhr.responseText);
	    }
	};
	var data = JSON.stringify(map_info);
	xhr.send(data);
}

function draw(e)
{
  // mouse left button must be pressed

  if (e.buttons !== 1) return;
  if (addwaypoint.checked)
  {
  	return;
  }
  
  ctx.beginPath(); // begin

  ctx.lineWidth = stroke_width;
  ctx.lineCap = 'round';
  ctx.strokeStyle = pen_color;
  if(document.getElementById('pen').checked) 
  {
  	ctx.globalCompositeOperation="source-over";
  	ctx.moveTo(pos.x, pos.y); // from
  	setPosition(e);
  	ctx.lineTo(pos.x, pos.y); // to

  	ctx.stroke(); // draw it!

  //Male radio button is checked
   }
   else if(document.getElementById('eraser').checked) 
   {
	  //Female radio button is checked
	  ctx.globalCompositeOperation="destination-out";
      ctx.arc(pos.x,pos.y,stroke_width,0,Math.PI*2,false);
      setPosition(e);
      ctx.fill();
	}  
}




function get_map_names()
{
	$.ajax(
	{
		async: false,
		type: 'POST',
		url: 'http://0.0.0.0:8000/all_maps.php',
		success: function(data)
		{
			data = JSON.parse(data);
			var select = document.getElementById("mapselect");
			data.forEach(map => 
			{
				var opt = document.createElement("option");
				opt.value = map;
	   			opt.innerHTML = map;
	   			select.appendChild(opt);
			});
		}
	});
}
