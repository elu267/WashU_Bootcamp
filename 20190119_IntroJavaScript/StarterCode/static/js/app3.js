// from data.js - holds the sightings data
var sightings = data;

// selecting 
var tbody = d3.select('tbody');
var submit = d3.select("#filter-btn");

// update function to update the table with a new dataset
function updateTable(filteredReport) {
    tbody.html('');
    filteredReport.forEach((toBeDetermined) => {
        var row = tbody.append('tr');
        Object.entries(toBeDetermined).forEach(([key, value]) => {
            var cell = tbody.append('td');
            cell.text(value);
        });
    });
}

function filterDate(filteredReport) {
    var dateElement = d3.select('#datetime');
    // getting the value property of the input element when user clicks submit
    var dateInput = dateElement.property("value");
    // prints the value that was entered into the input form
    console.log(dateInput);
    console.log(sightings);
    // use the input form input to filter the data by date
    var filterByDate = filteredReport.filter(getDates => getDates.datetime === dateInput);
    // prints the filtered values to the console log
    console.log(filterByDate);
    return filterByDate;
}

function filterCity(filteredReport) {
    var cityElement = d3.select('#city');
    var cityInput = cityElement.property("value");
    console.log(cityInput);
    console.log(sightings);
    var filterByCity = filteredReport.filter(getCity => getCity.city === cityInput);
    console.log(filterByCity);
    return filterByCity;
}

function filterState(filteredReport) {
    var stateElement = d3.select('#state');
    var stateInput = stateElement.property("value");
    console.log(stateInput);
    console.log(sightings);
    var filterByState = filteredReport.filter(getState => getState.state === stateInput);
    console.log(filterByState);
    return filterByState;
}

function filterCountry(filteredReport) {
    var countryElement = d3.select('#country');
    var countryInput = countryElement.property("value");
    console.log(countryInput);
    console.log(sightings);
    var filterByCountry = filteredReport.filter(getCountry => getCountry.country === countryInput);
    console.log(filterByCountry);
    return filterByCountry;
}

function filterShape(filteredReport) {
    var shapeElement = d3.select('#shape');
    var shapeInput = shapeElement.property("value");
    console.log(shapeInput);
    console.log(sightings);
    var filterByShape = filteredReport.filter(getShape => getShape.shape === shapeInput);
    console.log(filterByShape);
    return filterByShape;
}


function inputAll() {
    var dateElement = d3.select('#datetime');
    // getting the value property of the input element when user clicks submit
    var dateInput = dateElement.property("value");
    // prints the value that was entered into the input form
    console.log(dateInput);
    var cityElement = d3.select('#city');
    var cityInput = cityElement.property("value");
    console.log(cityInput);
    var stateElement = d3.select('#state');
    var stateInput = stateElement.property("value");
    console.log(stateInput);
    var countryElement = d3.select('#country');
    var countryInput = countryElement.property("value");
    console.log(countryInput);
    var shapeElement = d3.select('#shape');
    var shapeInput = shapeElement.property("value");
    console.log(shapeInput);

    // return filterByShape;
}

function filterAll(userInput) {

}

// updateTable(sightings);
//complete the click handler for the form
submit.on("click", function() {
    d3.event.preventDefault();
    var result = inputAll();
    // updateTable(result);
});