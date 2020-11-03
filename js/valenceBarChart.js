

/**
 * Method to create a Valence BarChart
 *  - Creating chart via pure function rather than prototype inspired by work done by Nadieh Bremer
 * 
 * @param id of chart to select, based on language 
 * @param data of valence for given story
 * @param options flags, to overwrite defaults
 */
const ValenceBarChart = (id, data, options) => {
    let activeOptions = {
		w: 450,				
		h: 450,
		margin: {top: 20, right: 20, bottom: 20, left: 20}, 
				
		maxValue: 0,
	};
	
	//Convert incoming options argument, overwriting defaults stored in activeOptions dictionary above
	if('undefined' == typeof options)
		console.log("NOTICE: No options identified for chart at "+id+": using default settings.");
	else
		for(let i in options)
			if('undefined' !== typeof options[i])
				activeOptions[i] = options[i];
    
    // clear possible previous SVG and create a new one
    d3.select(id).select("svg")
        .remove();
    const svg = d3.select(id)
        .append("svg")
			.attr("width",  activeOptions.w + activeOptions.margin.left + activeOptions.margin.right)
			.attr("height", activeOptions.h + activeOptions.margin.top + activeOptions.margin.bottom)
            .attr("class", "valence_bar_chart_"+id);
            
    // Call tooltip
	svg.call(tip);

    const valenceScale = d3.scaleBand()
        .domain( valenceXScaleDomain )
        .range( valenceXScaleRange );

    const quantityScale = d3.scaleLinear()
        .domain( [0, activeOptions.maxValue] )
        .range( valenceYScaleRange );
    
	const xAxis = d3.axisBottom()
		.scale( valenceScale )
		.tickValues( ["positive", "negative"] );

	const yAxis = d3.axisLeft()
		.scale( quantityScale )
		.tickValues( [0, 25, 50, 75, 100, 125, 150] );

	xGroup = svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (activeOptions.h) + ")")
		.call(xAxis);
	xGroup.append("text").text("Emotional Valence")
		.attr("x", activeOptions.w / 2)
		.attr("y", activeOptions.margin.bottom+20)
		.attr("text-anchor", "bottom")
		.attr("fill", "black");

	yGroup = svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(50, 0)") 
		.call(yAxis);
	yGroup.append("text").text("Token Count")
		.attr("x", -1* (activeOptions.w/2) )
		.attr("y", -1* (activeOptions.margin.left / 2) - 20)
		.attr("fill", "black")
        .attr("transform", "rotate(-90)");
        
    svg.selectAll("rect").data(data)
        .enter().append("rect")
        .merge(svg)
            .attr("transform", "translate(460, 900) rotate(180)") 
            .attr("x", (d) => valenceScale( d["axis"] ) )
            .attr("y", 450)
            .attr("height", (d) => 450-quantityScale(d["value"]) )
            .attr("width", 120 )
            .style("fill", activeOptions.color)
            .style("opacity", 0.5)

            .on('mouseover', (event, d) => {
				tip.show(event, d); 
			})
			.on('mouseout', tip.hide )
}