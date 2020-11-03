const LengthChart = (id, data, options) => {
    let activeOptions = {
		w: 500,				
		h: 300,
		margin: {top: 20, right: 20, bottom: 20, left: 20}, 
				
        length: 0,
        language: "invalid",
        color: "white"

	};

    // Convert incoming options argument, overwriting defaults stored in activeOptions dictionary above
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
            .attr("class", "length_chart_"+id);

    // Call tooltip
    svg.call(lengthTip);
    
    // append the rectangles
    svg.selectAll("rect").data(data)
        .enter().append("rect")
            .attr("class", "length-rectangle")
        .merge(svg)
            .attr("height", "50")
            .attr("width", (d) => lengthScale(d) )
            .attr("x", (d,i) => 5+((i%4) * 120))
            .attr("y", (d,i) => 5+(Math.floor( (i/4) ) * 70))
            .attr("fill", activeOptions.color)
            .style("opacity", 0.7)
            .on('mouseover', (event, d) => lengthTip.show( event, d, activeOptions.length ))
			.on('mouseout', lengthTip.hide )

}