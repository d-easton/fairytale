/////////////////////////////////////////////////////////
/////////////// The Radar Chart Function ////////////////
/////////////// Written by Nadieh Bremer ////////////////
////////////////// VisualCinnamon.com ///////////////////
/////////// Inspired by the code of alangrafu ///////////
/////////////////////////////////////////////////////////
	
const RadarChart = (id, data, options) => {
	let activeOptions = {
	 w: 400,				//Width of the circle
	 h: 400,				//Height of the circle
	 margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
	 levels: 3,				//How many levels or inner circles should there be drawn
	 maxValue: 0, 			//What is the value that the biggest circle will represent
	 labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
	 wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
	 opacityArea: 0.35, 	//The opacity of the area of the blob
	 dotRadius: 4, 			//The size of the colored circles of each blog
	 opacityCircles: 0.1, 	//The opacity of the circles of each blob
	 strokeWidth: 2, 		//The width of the stroke around each blob
	 roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
	 color: "#000000",	
	 colorDark: "#ffffff"
	};
	
	//Convert incoming options argument, overwriting defaults stored in activeOptions dictionary above
	if('undefined' !== typeof options)
		for(let i in options)
			if('undefined' !== typeof options[i])
				activeOptions[i] = options[i];
	
	// Configure stuff for the axes and circles
	const maxValue = activeOptions["maxValue"];		
	const allAxis = [];
	data.forEach ((elem) => allAxis.push(elem["axis"]) )
	
	// configure background circle stuff
	const total = allAxis.length; 											// Total number of  axes
	const radius = Math.min(activeOptions.w/2, activeOptions.h/2); 			// Radius of the outermost circle
	const angleRadians = Math.PI * 2 / total;								// The width in radians of each "slice"
	
	//Scale for the radius
	var radiusScale = d3.scaleLinear()
		.range([0, radius])
		.domain([0, maxValue]);
		

	
	// Set up canvas
    // Clear svg of previous chart, and add new svg in its place
	d3.select(id).select("svg").remove();
	const svg = d3.select(id).append("svg")
			.attr("width",  activeOptions.w + activeOptions.margin.left + activeOptions.margin.right)
			.attr("height", activeOptions.h + activeOptions.margin.top + activeOptions.margin.bottom)
			.attr("class", "radar"+id);
	//Append a g element		
	var g = svg.append("g")
			.attr("transform", "translate(" + (activeOptions.w/2 + activeOptions.margin.left) + "," + (activeOptions.h/2 + activeOptions.margin.top) + ")");
	
	


	// Setup and drwaw backgorund stuff (circles and axes)

	//Wrapper for the grid & axes
	const axisGrid = g.append("g").attr("class", "axisWrapper");
	const scaleCircles = [1,2,3,4,5];
	
	//Draw the scale circles, which make the background of the radar chart
	axisGrid.selectAll("circle").data(scaleCircles)
	   	.enter()   
			.append("circle")
		.merge(axisGrid)
			.attr("class", "gridCircle")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", (d) =>  radius/activeOptions.levels*d )
			.style("fill", "white")
			.style("stroke", "white")
			.style("stroke-width", "3px")
			.style("opacity", "0.2")

	//Text indicating at what count each level is
	axisGrid.selectAll(".axisLabel").data(scaleCircles)
	   	.enter().append("text")
	   		.attr("class", "axisLabel")
			.attr("x", 4)
			.attr("y", (d) => -d*radius/activeOptions.levels)
			.style("font-size", "10px")
			.attr("fill", "#737373")
			.text( (d) => maxValue * d/activeOptions.levels );

	
	//Create the straight lines radiating outward from the center
	const axis = axisGrid.selectAll(".axis").data(allAxis)
		.enter()
			.append("g")
			.attr("class", "axis");
        
	//Append the lines
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", (d, i) => radiusScale(maxValue*1.1) * Math.cos(angleRadians*i - Math.PI/2) )
		.attr("y2", (d, i) => radiusScale(maxValue*1.1) * Math.sin(angleRadians*i - Math.PI/2) )
		.attr("class", "line")
		.style("stroke", "white")
		.style("stroke-width", "2px");

	//Append the labels at each axis
	axis.append("text")
		.attr("class", "legend")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", (d, i) => radiusScale(maxValue * activeOptions.labelFactor) * Math.cos(angleRadians*i - Math.PI/2))
		.attr("y", (d, i) => radiusScale(maxValue * activeOptions.labelFactor) * Math.sin(angleRadians*i - Math.PI/2))
		.text((d) => d)
		.call(wrap, activeOptions.wrapWidth);

	
	// Draw radar blobs and anchor circles
	
	//The radial line function
	const radarLine = d3.lineRadial();
	radarLine.curve(d3.curveLinearClosed)
	radarLine.radius((d) => radiusScale(d.value))
	radarLine.angle((d,i) => i*angleRadians );
		
	if(activeOptions.roundStrokes) {
		radarLine.curve(d3.curveCardinalClosed);
	}
				
	//Create a wrapper for the blobs	
	var blobWrapper = g.selectAll(".radarWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarWrapper");
			
	//Append the backgrounds	
	blobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", radarLine(data))
		.style("fill", activeOptions.color)
		.style("opacity", "0.1");
		
	//Create the outlines	
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", (d,i) => radarLine(data))
		.style("stroke-width", "1px")
		.style("stroke", activeOptions.color)
		.style("fill", "none");		
	
	//Append the circles
	blobWrapper.selectAll(".radarCircle").data(data)
		.enter().append("circle")
		.attr("class", "radarCircle")
		.attr("r", activeOptions.dotRadius)
		.attr("cx", (d,i) => radiusScale(d.value) * Math.cos(angleRadians*i - Math.PI/2) )
		.attr("cy", (d,i) => radiusScale(d.value) * Math.sin(angleRadians*i - Math.PI/2) )
		.style("fill", activeOptions.colorDark)
		.style("opacity", 0.8);

	

	//Helper method for SVG text, a la Mike Bostock -- http://bl.ocks.org/mbostock/7555321
	//Wraps SVG text	
	function wrap(text, width) {
	  text.each(function() {
		var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.4, // ems
			y = text.attr("y"),
			x = text.attr("x"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
			
		while (word = words.pop()) {
		  line.push(word);
		  tspan.text(line.join(" "));
		  if (tspan.node().getComputedTextLength() > width) {
			line.pop();
			tspan.text(line.join(" "));
			line = [word];
			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		  }
		}
	  });
	}	
	
}