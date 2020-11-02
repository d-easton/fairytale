/////////////////////////////////////////////////////////
/////////////// The Radar Chart Function ////////////////
/////////////// Written by Nadieh Bremer ////////////////
////////////////// VisualCinnamon.com ///////////////////
/////////// Inspired by the code of alangrafu ///////////
/////////////////////////////////////////////////////////
	
const RadarChart = (id, data, options) => {
	let activeOptions = {
		w: 400,				
		h: 400,
		margin: {top: 20, right: 20, bottom: 20, left: 20}, 
		originX: 0,
		originY: 0,
		
		levels: 3,				
		maxValue: 0, 		// largest possible value for any axis

		labelFactor: 1.25, 	//Space label from axes end
		wrapWidth: 60, 		//The number of pixels after which text in a label needs to be given a new line
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
	const radiusFactor = radius/activeOptions.levels;
	const angleRadians = Math.PI * 2 / total;								// The width in radians of each "slice" of the radar chart
	const scaleCircles = [1,2,3,4,5];
	const circleColor = "white";

	//Scale for the radius
	const radiusScale = d3.scaleLinear()
		.range([0, radius])
		.domain([0, maxValue]);
		


	// Set up canvas
    // Clear svg of previous chart, and add new svg in its place
	d3.select(id).select("svg").remove();
	const svg = d3.select(id).append("svg")
			.attr("width",  activeOptions.w + activeOptions.margin.left + activeOptions.margin.right)
			.attr("height", activeOptions.h + activeOptions.margin.top + activeOptions.margin.bottom)
			.attr("class", "emotive_radar_chart_"+id);	
	const g = svg.append("g")
			.attr("transform", "translate(" + (activeOptions.w/2 + activeOptions.margin.left) + "," + (activeOptions.h/2 + activeOptions.margin.top) + ")");
	
	
	//Draw the scale circles with appropriate number labels, which make the background of the radar chart
	const axisGrid = g.append("g").attr("class", "axisWrapper");
	axisGrid.selectAll("circle").data(scaleCircles)
	   	.enter()   
			.append("circle")
		.merge(axisGrid)
			.attr("class", "gridCircle")
			.attr("cx", activeOptions.originX)
			.attr("cy", activeOptions.originY)
			.attr("r", (d) => radiusFactor * d )
			.style("fill", circleColor)
			.style("stroke", circleColor)
			.style("stroke-width", "3px")
			.style("opacity", "0.2")
	axisGrid.selectAll(".axisLabel").data(scaleCircles)
	   	.enter().append("text")
	   		.attr("class", "axisLabel")
			.attr("x", 4)
			.attr("y", (d) => -1 * (d * radiusFactor) )
			.style("font-size", "10px")
			.attr("fill", "#737373")
			.text( (d) => maxValue * d/activeOptions.levels );

	

        
	// Draw the axes	
	const axis = axisGrid.selectAll(".axis").data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");
	axis.append("line")
		.attr( "x1", activeOptions.originX )
		.attr( "y1", activeOptions.originY )
		.attr( "x2", (d, i) => radiusScale(maxValue * 1.1) * Math.cos(angleRadians * i - Math.PI/2) )
		.attr( "y2", (d, i) => radiusScale(maxValue * 1.1) * Math.sin(angleRadians * i - Math.PI/2) )
		.attr( "class", "line" )
		.style( "stroke", circleColor )
		.style( "stroke-width", "2px" );

	// Label the axes
	axis.append("text")
		.attr( "class", "legend")
		.style( "font-size", "11px")
		.attr( "text-anchor", "middle")
		.attr( "dy", "0.35em")
		.attr( "x", (d, i) => radiusScale(maxValue * activeOptions.labelFactor) * Math.cos( angleRadians * i - Math.PI/2) )
		.attr( "y", (d, i) => radiusScale(maxValue * activeOptions.labelFactor) * Math.sin( angleRadians * i - Math.PI/2) )
		.text( (d) => d )
		.call(wrap, activeOptions.wrapWidth);

	
	// Draw blobs and anchor circles
	
	// Define the lineRadial function which will allow for curves
	const radarLine = d3.lineRadial();
	radarLine.curve(d3.curveLinearClosed);
	radarLine.radius((d) => radiusScale(d.value));
	radarLine.angle((d,i) => i*angleRadians );
		
	if(activeOptions.roundStrokes)
		radarLine.curve(d3.curveCardinalClosed);
				
	// Draw the curved blobs	
	const blobWrapper = g.selectAll(".radarWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarWrapper");	
	blobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", radarLine(data))
		.style("fill", activeOptions.color)
		.style("opacity", "0.1");	
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", (d,i) => radarLine(data))
		.style("stroke-width", "1px")
		.style("stroke", activeOptions.color)
		.style("fill", "none");		
	
	// draw the anchor circles, tieing blob to a spot on each axis
	blobWrapper.selectAll(".radarCircle").data(data)
		.enter().append("circle")
		.attr("class", "radarCircle")
		.attr("r", "4px")
		.attr("cx", (d,i) => radiusScale(d.value) * Math.cos(angleRadians*i - Math.PI/2) )
		.attr("cy", (d,i) => radiusScale(d.value) * Math.sin(angleRadians*i - Math.PI/2) )
		.style("fill", activeOptions.colorDark)
		.style("opacity", 0.8);


	// support code to wrap SVG text, a la Mike Bostock -- http://bl.ocks.org/mbostock/7555321	
	function wrap(text, width) {
	  	text.each(function() {
			let text = d3.select(this),
				words = text.text().split(/\s+/).reverse(),
				word;
			const y = text.attr("y"),
				x = text.attr("x"),
				dy = parseFloat(text.attr("dy"));
			let line = [],
				lineNumber = 0,
				lineHeight = 1.4,
				tspan = text.text(null).append("tspan")
					.attr("x", x)
					.attr("y", y)
					.attr("dy", dy + "em");
				
			while (word = words.pop()) {
				line.push(word);
				tspan.text(line.join(" "));
				if (tspan.node().getComputedTextLength() > width) {
					line.pop();
					tspan.text(line.join(" "));
					line = [word];
					tspan = text.append("tspan").attr("x", x)
						.attr("y", y)
						.attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
				}
			}
		});
	}	
}