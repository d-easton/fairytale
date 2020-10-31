/**
 * 
 * Helper functions
 * 
 */

 // Helpers for navbar.js

 const handleNavbarClick = (id) => {

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

    id = id-1;
    // load json for given story pair, then update all charts
    // const extractYear = id.substring(10);
    return d3.json("../data/emotive_pairs/pair_"+id+".json"); 
    
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
    console.log(cleanedTitles);
    return cleanedTitles;
}