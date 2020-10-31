/**
 * Constructor for the Navigation Bar
 *
 * @param lengthChartEN instance of ElectoralVoteChart
 * @param tileChart instance of TileChart
 * @param votePercentageChart instance of Vote Percentage Chart
 * @param electionInfo instance of ElectionInfo
 * @param electionWinners data corresponding to the winning parties over mutiple election years
 */
function Navbar(lengthChartEN, lengthChartDE, stories) {
// function Navbar( stories) {
    let self = this;

    self.lengthChartEN = lengthChartEN;
    self.lengthChartDE = lengthChartDE;
    
    self.stories = stories;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
Navbar.prototype.init = function(){

    let self = this;
    self.margin = {top: 10, right: 20, bottom: 30, left: 50};
    let divNavbar = d3.select("#navbar").classed("fullView", true);

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divNavbar.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 100;

    //creates svg element within the div
    self.svg = divNavbar.append("svg")
        .attr("id", "navbar-SVG")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
};

/**
 * 
 * Creates a navbar with clickable recangles representing each story
 */
Navbar.prototype.update = function(){
    let self = this;
    // let clicked = null;

    // Create the chart by adding circle elements representing each election year, colored based on the winning party
    const nav = d3.select("#navbar-SVG").selectAll("rect").data(self.stories);

    nav.enter().append("rect")
        .attr("id", (d) => "story-"+(d["navNumber"]))
        .attr("class", "navbar-tab")
        .attr("width", "90")
        .attr("height", "60")
        .attr("x", (d,i) => i*115)
        .attr("y", 0)
        .on("click", (e,d) => handleNavbarClick(d["navNumber"]) );

    //Append text information of each year right below the corresponding circle
    nav.enter().append("text")
        .attr("id", (d,i) => "story-"+(i+1)+"-text")
        .attr("class", "navbar-tab-txt german-font")
        .attr("x", (d,i) => 27.5+(i*115))
        .attr("y", 45)
        .text( (d,i) => (i+1)+"." )
        .on("click", (e,d) => handleNavbarClick(d["navNumber"]).then( (data) => {
            for (const [key, value] of Object.entries(data)) {
                const currentLang = determineLanguageFromTitle(key);
                if(currentLang == "english") {
                    $("#english-story-title").text(key);
                    $("#english-col-icon").text(titleIcons[key]);
                }
                else if (currentLang == "german") {
                    cleanedTitles = splitCompoundTitle(key);
                    $("#german-story-title").text(cleanedTitles[0]);
                    $("#german-story-subtitle").text('('+cleanedTitles[1]+')');
                    $("#german-col-icon").text(titleIcons[key]);
                }
            }
            console.log(data);
        }));
};
