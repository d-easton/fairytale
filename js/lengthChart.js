// /**
//  * Constructor for the LengthChart
//  *
//  * @param brushSelection an instance of the BrushSelection class
//  */
// function LengthChart (language) {
//     const self = this;
//     self.language = language;
//     self.init();
// };

// /**
//  * Initializes the svg elements required for this chart
//  */
// LengthChart.prototype.init = (language) => {
//     const self = this;
//     // self.language = language;
//     self.margin = {top: 30, right: 20, bottom: 30, left: 50};

//     // Grab the proper div for this chart, based on if its english or german
//     const div = d3.select("#"+self.langauge+"-length-chart");

//     // self.svgBounds = div.getBoundingClientRect();
//     // self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
//     // self.svgHeight = 300;
    
//     console.log("--create #"+self.language+"-length-chart");
//     //creates svg element within the div
//     const s = div.append("svg")
//         .attr("width", 500)
//         .attr("height", 300)
//         .attr("id", self.language+"-length-svg");
//     console.log(s);
// }

// LengthChart.prototype.update = (storyLength) => {
//     var self = this;

//     const selector = "#"+self.language+"-length-svg";
//     // console.log("TEST SELECTOR TEST SELECTOR TEST SELECTOR");
//     // console.log(selector);
//     // console.log(storyLength);
//     const lC = d3.select(selector).selectAll("rect").data(storyLength);
//         lC.exit().remove();
//         lC.enter()
//             .append("rect")
//                 .attr("class", "length-rectangle")
//                 .attr("height", "50")
//                 .attr("width", "60" )
//             .merge(lC)
//                 .attr("x", (d,i) => (i%4) * 80)
//                 .attr("y", (d,i) => Math.floor( (i/4) ) * 70)
//                 .attr("fill", "black");
    
// }
