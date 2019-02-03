// Set up chart
var svgWidth = 960; //window.innerWidth;
var svgHeight = 660; //window.innerHeight;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper to hold the chart,
// and shift the latter by left and top margins.
var svg = d3
    .select("#scatter") // selects the scatter ID within the index.html
    .append("svg") // adds an svg element to the index
    .attr("width", svgWidth) // sets the width of the charting area
    .attr("height", svgHeight); // sets the height of the charting area

// append svg group element
var chartGroup = svg.append("g") // adds a group tag element to the index.html
    .attr("transform", `translate(${margin.left}, ${margin.top})`); // define svg as a G element that translates the origin to the top-left corner of the chart area

// create the initial parameter for the chosen x and y axes 
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale variable upon clicking on the x axis label
function xScale(censusData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        // takes the min and max of the chosen column of data and builds the scale for the x axis
        .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
            d3.max(censusData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;
};

// function used for updating y-scale variable upon clicking on the y axis label
function yScale(censusData, chosenYAxis) {
    //create scales
    var yLinearScale = d3.scaleLinear()
        // takes the min and max of teh chosen column of data and builds the scale for the y axis
        .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
            d3.max(censusData, d => d[chosenYAxis]) * 1.2
        ])
        .range([height, 0]);

    return yLinearScale;
};

// function used for updating xAxis and yAxis variables upon click on x axis label
function renderAxes(newXScale, newYScale, xAxis, yAxis) {
    var bottomAxis = d3.axisBottom(newXScale); // removed .ticks(7)
    var leftAxis = d3.axisLeft(newYScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return xAxis, yAxis;
};

// function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, newYScale) {
    circlesGroup.selectAll("circle").transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", e => newYScale(e[chosenYAxis]));
    circlesGroup.selectAll("text").transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", e => newYScale(e[chosenYAxis]));

    return circlesGroup;
};

// for the love of formatting - geezus! I do not want any grief for the % formatting hacks below.
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

//function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    if (chosenXAxis === "poverty" & chosenYAxis === "healthcare") {
        var labelX = "Poverty: ";
        var labelY = "Healthcare: ";
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([80, -60])
            .html(function(d) {
                return (`${d.state}<br>${labelX}${d[chosenXAxis]}%<br>${labelY}${d[chosenYAxis]}%`); // may need to figure out how to format the ticks
            });
    }
    if (chosenXAxis === "poverty" & chosenYAxis === "smokes") {
        var labelX = "Poverty: ";
        var labelY = "Smokes: ";
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([80, -60])
            .html(function(d) {
                return (`${d.state}<br>${labelX}${d[chosenXAxis]}%<br>${labelY}${d[chosenYAxis]}%`); // may need to figure out how to format the ticks
            });
    }
    if (chosenXAxis === "poverty" & chosenYAxis === "obesity") {
        var labelX = "Poverty: ";
        var labelY = "Obesity: ";
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([80, -60])
            .html(function(d) {
                return (`${d.state}<br>${labelX}${d[chosenXAxis]}%<br>${labelY}${d[chosenYAxis]}%`); // may need to figure out how to format the ticks
            });
    }
    if (chosenXAxis === "age" & chosenYAxis === "healthcare") {
        var labelX = "Median Age: ";
        var labelY = "Healthcare: ";
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([80, -60])
            .html(function(d) {
                return (`${d.state}<br>${labelX}${d[chosenXAxis]}<br>${labelY}${d[chosenYAxis]}%`); // may need to figure out how to format the ticks
            });
    }
    if (chosenXAxis === "age" & chosenYAxis === "smokes") {
        var labelX = "Median Age: ";
        var labelY = "Smokes: ";
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([80, -60])
            .html(function(d) {
                return (`${d.state}<br>${labelX}${d[chosenXAxis]}<br>${labelY}${d[chosenYAxis]}%`); // may need to figure out how to format the ticks
            });
    }
    if (chosenXAxis === "age" & chosenYAxis === "obesity") {
        var labelX = "Median Age: ";
        var labelY = "Obesity: ";
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([80, -60])
            .html(function(d) {
                return (`${d.state}<br>${labelX}${d[chosenXAxis]}<br>${labelY}${d[chosenYAxis]}%`); // may need to figure out how to format the ticks
            });
    }
    if (chosenXAxis === "income" & chosenYAxis === "healthcare") {
        var labelX = "Income: ";
        var labelY = "Healthcare: ";
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([80, -60])
            .html(function(d) {
                return (`${d.state}<br>${labelX}${numberWithCommas(d[chosenXAxis])}<br>${labelY}${d[chosenYAxis]}%`); // may need to figure out how to format the ticks
            });
    }
    if (chosenXAxis === "income" & chosenYAxis === "smokes") {
        var labelX = "Income: ";
        var labelY = "Smokes: ";
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([80, -60])
            .html(function(d) {
                return (`${d.state}<br>${labelX}${numberWithCommas(d[chosenXAxis])}<br>${labelY}${d[chosenYAxis]}%`); // may need to figure out how to format the ticks
            });
    }
    if (chosenXAxis === "income" & chosenYAxis === "obesity") {
        var labelX = "Income: ";
        var labelY = "Obesity: ";
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([80, -60])
            .html(function(d) {
                return (`${d.state}<br>${labelX}${numberWithCommas(d[chosenXAxis])}<br>${labelY}${d[chosenYAxis]}%`); // may need to figure out how to format the ticks
            });
    };

    // var toolTip = d3.tip()
    //     .attr("class", "d3-tip")
    //     .offset([80, -60])
    //     .html(function(d) {
    //         return (`${d.state}<br>${labelX}${d[chosenXAxis]}<br>${labelY}${d[chosenYAxis]}`); // may need to figure out how to format the ticks
    //     });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
            toolTip.show(data);
        })
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
};

// Step 3:
// Import the census data file
// =================================
d3.csv("data.csv", function(error, censusData) {
    if (error) return console.warn("error: ", error);
    // console.log(censusData);

    // Step 4: Parse the data
    // Format the data and convert to numerical and date values
    // =================================
    censusData.forEach(function(data) {
        data.age = parseFloat(data.age);
        data.ageMoe = parseFloat(data.ageMoe);
        data.healthcare = parseFloat(data.healthcare);
        data.healthcareHigh = parseFloat(data.healthcareHigh);
        data.healthcareLow = parseFloat(data.healthcareLow);
        data.id = +data.id;
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;
        data.obesity = parseFloat(data.obesity);
        data.obesityHigh = parseFloat(data.obesityHigh);
        data.obesityLow = parseFloat(data.obesityLow);
        data.poverty = parseFloat(data.poverty);
        data.povertyMoe = parseFloat(data.povertyMoe);
        data.smokes = parseFloat(data.smokes);
        data.smokesHigh = parseFloat(data.smokesHigh);
        data.smokesLow = parseFloat(data.smokesLow);
        // console.log("age", data.age);
        // console.log("ageMoe", data.ageMoe);
        // console.log("healthcare", data.healthcare);

    });

    // Step 5: Create Scales
    //= ============================================
    var xLinearScale = xScale(censusData, chosenXAxis);

    // create y scale function
    var yLinearScale = yScale(censusData, chosenYAxis);

    //create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale).ticks(7);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 7: Append the axes to the chartGroup - ADD STYLING
    // ==============================================
    // Add bottomAxis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // CHANGE THE TEXT TO THE CORRECT COLOR
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);


    // append initial circles
    var circlesGroup = chartGroup.selectAll("stateCircle") // "stateCircle was previously g tag"
        .data(censusData)
        .enter().append("g");
    circlesGroup.append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", e => yLinearScale(e[chosenYAxis]))
        .attr("r", "10")
        .attr("class", "stateCircle"); // refer to d3Style.css file

    circlesGroup.append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", e => yLinearScale(e[chosenYAxis]))
        .attr("dx", ".05em")
        .attr("dy", ".35em")
        .text(d => d.abbr)
        .attr("class", "stateText") // refer d3Style.css file
        .attr("font-size", "10px");

    // create group for 3 xAxis labels
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (Median)");

    var incomeLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income (Median)");

    // Create group for 3 y axis labels

    var labelYGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

    var healthcareLabel = labelYGroup.append("text")
        .attr("y", 60 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "healthcare")
        .classed("active", true)
        .text("Lacks Healthcare (%)");

    var smokesLabel = labelYGroup.append("text")
        .attr("y", 40 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("Smokes (%)");

    var obeseLabel = labelYGroup.append("text")
        .attr("y", 20 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "obesity")
        .classed("inactive", true)
        .text("Obese (%)");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // x axis labels event listener
    labelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {
                // replaces chosenXAxis with value
                chosenXAxis = value;
                //console.log(chosenXAxis)
                // updates x scale for new data
                xLinearScale = xScale(censusData, chosenXAxis);

                // updates x axis with transition
                xAxis, yAxis = renderAxes(xLinearScale, yLinearScale, xAxis, yAxis);
                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale);
                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // changes classes to change bold text
                if (chosenXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else if (chosenXAxis === "age") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
    // y axis labels event listener
    labelYGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {
                // replaces chosenYAxis with value
                chosenYAxis = value;
                //console.log(chosenYAxis)
                // updates y scale for new data
                yLinearScale = yScale(censusData, chosenYAxis);

                // updates x axis with transition
                xAxis, yAxis = renderAxes(xLinearScale, yLinearScale, xAxis, yAxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale);
                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
                // changes classes to change bold text
                if (chosenYAxis === "healthcare") {
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obeseLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else if (chosenYAxis === "smokes") {
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obeseLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else {
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obeseLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
});