/**
 * Constructor for the Navigation Bar
 *
 * @param lengthChartEN instance of ElectoralVoteChart
 * @param tileChart instance of TileChart
 * @param votePercentageChart instance of Vote Percentage Chart
 * @param electionInfo instance of ElectionInfo
 * @param electionWinners data corresponding to the winning parties over mutiple election years
 */
function Navbar( lengthChartEN, lengthChartDE, stories) {
// function Navbar( stories) {  ,
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
    

    //Linear scale for length charts rectangles
    self.lengthScale = d3.scaleLinear()
        .domain(lengthChartDomain)
        .range(lengthChartRange);

    // linear scale for navbar rects
    self.navScale = d3.scaleLinear()
        .domain(navSVGDomain)
        .range(navSVGRange);

    // Create the chart by adding circle elements representing each election year, colored based on the winning party
    const nav = d3.select("#navbar-SVG").selectAll("rect").data(self.stories);

    nav.enter().append("rect")
        .attr("id", (d) => "story-"+(d["navNumber"]))
        .attr("class", "navbar-tab")
        .attr("width", "100")
        .attr("height", "70")
        .attr("x", (d,i) => self.navScale(i) )
        .attr("y", 0)
        .on("click", (e,d) => handleNavbarClick(d["navNumber"]) );

    //Append text information of each year right below the corresponding circle
    nav.enter().append("text")
        .attr("id", (d,i) => "story-"+(i+1)+"-text")
        .attr("class", "navbar-tab-txt german-font")
        .attr("x", (d,i) => 30+self.navScale(i))
        .attr("y", 50)
        .text( (d,i) => (i+1)+"." )
        .on("click", (e,d) => handleNavbarClick(d["navNumber"]).then( (stories) => {    // helper gets story data out of .json files

            let maxEmotiveScore = 0;
            for (const [title, data] of Object.entries( stories )) {
                for (const [index, emotion] of Object.entries( data["emotives"])) {
                    const score = emotion["value"];
                    if ( score > maxEmotiveScore)
                        maxEmotiveScore = score;
                }
            }
            // round it up to next interval of 50
            maxEmotiveScore = Math.round((maxEmotiveScore +25) / 50)*50;

            for (const [title, data] of Object.entries( stories )) {
                const currentLang = determineLanguageFromTitle(title);
                const radarMargin = {top: 100, right: 100, bottom: 100, left: 100};
                if(currentLang == "english") {
                    $("#english-story-title").text(title);
                    $("#english-col-icon").text(titleIcons[title]);

                    self.lengthChartEN.update( convertLengthToRectWidths( data['length'] ), self.lengthScale );

                    const englishRadarOptions = {
                        w: 400,    
                        h: 400, 
                        margin: radarMargin,
                        maxValue: maxEmotiveScore,
                        levels: 5,
                        roundStrokes: true,
                        color: "#98a8da",
                        colorDark: "#243e86"
                      };
                      RadarChart("#english-emotive-chart", data["emotives"], englishRadarOptions);
                    

                }
                else if (currentLang == "german") {
                    cleanedTitles = splitCompoundTitle(title);
                    $("#german-story-title").text(cleanedTitles[0]);
                    $("#german-story-subtitle").text('('+cleanedTitles[1]+')');
                    $("#german-col-icon").text(titleIcons[title]);
                    
                    self.lengthChartDE.update( convertLengthToRectWidths( data['length'] ), self.lengthScale );

                    const germanRadarOptions = {
                        w: 400,    
                        h: 400, 
                        margin: radarMargin,
                        maxValue: maxEmotiveScore,
                        levels: 5,
                        roundStrokes: true,
                        color:  "#996ea0",
                        colorDark: "#34385d"
                      };
                      RadarChart("#german-emotive-chart", data["emotives"], germanRadarOptions);
                }
            }

        }));
};
