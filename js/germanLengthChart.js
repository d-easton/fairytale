/**
 * Constructor for the LengthChart
 *
 * @param brushSelection an instance of the BrushSelection class
 */
function GermanLengthChart() {
    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
GermanLengthChart.prototype.init = () => {
    const self = this;
    self.language = "german";
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};

    // Grab the proper div for this chart, based on if its english or german
    let div = d3.select("#german-length-chart");

    //creates svg element within the div
    self.svg = div.append("svg")
        .attr("width", 500)
        .attr("height", 300)
        .attr("id", self.language+"-length-svg");
}

GermanLengthChart.prototype.update = (storyLength, lengthScale) => {
    var self = this;

    const selector = "#"+self.language+"-length-svg";
    const lC = d3.select(selector).selectAll("rect").data(storyLength);
        lC.exit().remove();
        lC.enter()
            .append("rect")
                .attr("class", "german-length-rectangle")
            .merge(lC)
                .attr("height", "50")
                .attr("width", (d) => lengthScale(d) )
                .attr("x", (d,i) => 5+((i%4) * 120))
                .attr("y", (d,i) => 5+(Math.floor( (i/4) ) * 70))
                .attr("fill", "#996ea0")
                .attr("stroke", "#34385d")
                .attr("stroke-width", 1);
    
}
