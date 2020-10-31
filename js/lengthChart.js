/**
 * Constructor for the LengthChart
 *
 * @param brushSelection an instance of the BrushSelection class
 */
function LengthChart(language) {
    var self = this;
    self.init(language);
};

/**
 * Initializes the svg elements required for this chart
 */
LengthChart.prototype.init = (language) => {
    const self = this;
    self.language = language;
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};

    // Grab the proper div for this chart, based on if its english or german
    const div = d3.select("#"+self.langauge+"-length-chart");
    console.log(div);
    // self.svgBounds = divelectoralVotes.node().getBoundingClientRect();
    // self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    // self.svgHeight = 150;
}
