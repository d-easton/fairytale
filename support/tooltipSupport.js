
/**
 * Renders the HTML content for tool tip used in emotive and valence charts
 *
 * @param data information that needs to be populated in the tool tip
 * @return text HTML content for tool tip
 */
const renderTooltip = (data) => {
    let text = "<h3>" + data.axis + "</h3>";
    text +=  "Score: " + data.score;
    return text;
}

/**
 * Defines a tool tip function
 *  This tip is used for the emotive and valence charts
 */
const tip = d3.tip().attr('class', 'd3-tip')
    .direction('se')
    .offset( () =>  [0,0])
    .html( (d, axisInfo) => {
 
        data = {
            "axis": axisInfo["axis"],
            "score": axisInfo["value"]
        }

        return renderTooltip(data);
});


/**
 * Renders the HTML content for tool tip used in length
 *
 * @param data information that needs to be populated in the tool tip
 * @return text HTML content for tool tip
 */
const renderLengthTooltip = (data) => {
    let text = "<p>This block contains " + data.wordsInBlock + " words.</p>";
    text +=  "<p>Total words: " + data.totalWords +"</p>";
    return text;
}

/**
 * Defines a tool tip function
 *  This tip is used for the length chart
 */
const lengthTip = d3.tip().attr('class', 'd3-tip')
    .direction('se')
    .offset( () =>  [0,0])
    .html( (e, wordsInBlock, totalWords) => {

        data = {
            "wordsInBlock": wordsInBlock,
            "totalWords": totalWords
        }

        return renderLengthTooltip(data);
});