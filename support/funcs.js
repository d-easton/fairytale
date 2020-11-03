/**
 * 
 * Helper functions
 * 
 */

 // Helpers for navbar.js

 const handleNavbarClick = (id) => {

    console.log("CLICK RECEIVED");

    // toggle active story
    const tabPrefix = "#story-";
    if ( d3.select(tabPrefix+id).classed("active-tab") ) {
        d3.select(tabPrefix+id).classed("active-tab", false); 
        d3.select(tabPrefix+id+"-text").classed("active-tab-txt", false);
    }   
    else {
        d3.select(tabPrefix+id).classed("active-tab", true);
        d3.select(tabPrefix+id+"-text").classed("active-tab-txt", true);
        turnOffOtherTabs(id);
    }

    // return the loaded json for the relevant story
    return d3.json("../data/emotive_pairs/pair_"+(id-1)+".json"); 
    
 }

 const turnOffOtherTabs = (skipID) => {
    const elems = Array.from(d3.selectAll(".navbar-tab"));
    elems.forEach( (e) => {
        const eID = "#"+e.id;
        const textID = eID + "-text";
        const sID = "#story-"+skipID;

        if (eID != sID) {
            d3.select(eID).classed("active-tab", false);
            d3.select(textID).classed("active-tab-txt", false);
        }
    })
 }

 const determineLanguageFromTitle = (title) => {
    if (englishTitles.indexOf(title) > -1)
        return 'english';
    else if (germanTitles.indexOf(title) > -1)
        return 'german';
    else
        return 'invalid';
 }

const splitCompoundTitle = (rawTitle) => {
    const cleanedTitles = rawTitle.split(":");
    return cleanedTitles;
}

// convert # of words into story into array of 200 word-long rectangles
const convertLengthToRectWidths = (length) => {
    rects = [];
    let l = length;
    while (l > 200) {
        l = l - 200;
        rects.push(200);
    }
    rects.push(l);
    return rects;
}