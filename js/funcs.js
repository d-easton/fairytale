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