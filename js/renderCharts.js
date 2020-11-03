
/**
 * Function to prepare and then call all 3 subordinate chart functions for each language column
 * 
 * @param {*} stories -- array of story dictionary objects, loaded from .json files by navbar.js
 */
const RenderCharts = (stories) => {
    console.log("HANDLE COMPLETE, JSON LOADED");
   
    let maxEmotiveScore = 0;
    let maxValence = 0;
    for (const [title, data] of Object.entries( stories )) {
        for (const [index, emotion] of Object.entries( data["emotives"])) {
            const score = emotion["value"];
            if ( score > maxEmotiveScore)
                maxEmotiveScore = score;
        }
        for (const [index, valence] of Object.entries( data["valence"])) {
            const score = valence["value"];
            if ( score > maxEmotiveScore)
                maxValence = score;
        }
    }
    // round them up to next interval of 50
    maxEmotiveScore = Math.round((maxEmotiveScore +25) / 50)*50;
    maxValence = Math.round((maxValence +25) / 50)*50;

    for (const [title, data] of Object.entries( stories )) {
        const currentLang = determineLanguageFromTitle(title);
        if(currentLang == "english") {

            // Update titles
            $("#english-story-title").text(title);
            $("#english-col-icon").text(titleIcons[title]);

            // Update length chart with options
            const englishLengthOptions = {
                w: 500,    
                h: 300,

                length: data["length"],
                color:  "#98a8da",
                language: "german"
            }
            LengthChart("#english-length-chart",  convertLengthToRectWidths( data['length'] ), englishLengthOptions);

            // Update emotive radar chart with options
            const englishEmotiveOptions = {
                w: 400,    
                h: 400, 
                margin: radarMargin,
                maxValue: maxEmotiveScore,
                levels: 5,
                roundStrokes: true,
                color: "#98a8da",
                colorDark: "#243e86"
            };
            RadarChart("#english-emotive-chart", data["emotives"], englishEmotiveOptions);
            
            // Update valence bar chart with options
            const englishValenceOptions = {
                w: 450,    
                h: 450,
                maxValue: maxValence,
                color: "#98a8da"
            }
            ValenceBarChart("#english-valence-chart", data["valence"], englishValenceOptions);

        }
        else if (currentLang == "german") {

            // Update titles
            cleanedTitles = splitCompoundTitle(title);
            $("#german-story-title").text(cleanedTitles[0]);
            $("#german-story-subtitle").text('('+cleanedTitles[1]+')');
            $("#german-col-icon").text(titleIcons[title]);
            
            // Update length chart with options
            const germanLengthOptions = {
                w: 500,    
                h: 300,

                length: data["length"],
                color:  "#996ea0",
                language: "german"
            }
            LengthChart("#german-length-chart",  convertLengthToRectWidths( data['length'] ), germanLengthOptions);

            // Update emotive radar chart with options
            const germanEmotiveOptions = {
                w: 400,    
                h: 400, 
                margin: radarMargin,
                maxValue: maxEmotiveScore,
                levels: 5,
                roundStrokes: true,
                color:  "#996ea0",
                colorDark: "#34385d"
            };
            RadarChart("#german-emotive-chart", data["emotives"], germanEmotiveOptions);

            // Update valence bar chart with options
            const germanValenceOptions = {
                w: 450,    
                h: 450,
                maxValue: maxValence,
                color:  "#996ea0"
            }
            ValenceBarChart("#german-valence-chart", data["valence"], germanValenceOptions);
        }
    }
};
