// from data.js - holds the sightings data
var sightings = data;

// converting array of object values to upper case for all keys that contain string values
sightings.forEach(function(a) { // begin loop
    ['city', 'state', 'country', 'durationMinutes', 'shape', 'comments'].forEach(function(k) {
        if (typeof a[k] === 'string') {
            a[k] = a[k].toUpperCase();
        }
    });
});

// console.log(sightings);

// create the drop down list for selecting a shape
var shapeUnique = [...new Set(sightings.map(item => item.shape))];
console.log(shapeUnique); // print results to test results

shapeUnique.sort();
console.log(shapeUnique);

// populating the drop down menu
var select = document.getElementById("shape"); // getting a reference to the shape ID
for (var i = 0; i < shapeUnique.length; i++) { // looping through shapeUnique array
    var opt = shapeUnique[i]; // creating a new option 
    var el = document.createElement("option"); // creating option tags
    el.textContent = opt; // adding label for the option
    el.value = opt; // adding the value for the option
    select.appendChild(el); // adding the element to the list of options
};

// selecting 
var tbody = d3.select('tbody'); // setting variable to select the table body
var submit = d3.select("#filter-btn"); // setting variable to select the filter button

// update function to update the table with a new dataset
function updateTable(filteredReport) { // declaring a function called updateTable
    tbody.html(''); // get the html contents of the first element in the set
    filteredReport.forEach((toBeDetermined) => { //start of the loop
        var row = tbody.append('tr'); // appending rows to the table body
        Object.entries(toBeDetermined).forEach(([key, value]) => { // start of next loop
            var cell = row.append('td'); // appending cells to rows
            cell.text(value); // adding cell values to the table cells
        });
    });
}
// Used for testing each filter individually
// function filterDate(filteredReport) {
//     var dateElement = d3.select('#datetime');
//     // getting the value property of the input element when user clicks submit
//     var dateInput = dateElement.property("value");
//     // prints the value that was entered into the input form
//     console.log(dateInput);
//     console.log(sightings);
//     // use the input form input to filter the data by date
//     var filterByDate = filteredReport.filter(getDates => getDates.datetime === dateInput);
//     // prints the filtered values to the console log
//     console.log(filterByDate);
//     return filterByDate;
// }

// function filterCity(filteredReport) {
//     var cityElement = d3.select('#city');
//     var cityInput = cityElement.property("value");
//     console.log(cityInput);
//     console.log(sightings);
//     var filterByCity = filteredReport.filter(getCity => getCity.city === cityInput);
//     console.log(filterByCity);
//     return filterByCity;
// }

// function filterState(filteredReport) {
//     var stateElement = d3.select('#state');
//     var stateInput = stateElement.property("value");
//     console.log(stateInput);
//     console.log(sightings);
//     var filterByState = filteredReport.filter(getState => getState.state === stateInput);
//     console.log(filterByState);
//     return filterByState;
// }

// function filterCountry(filteredReport) {
//     var countryElement = d3.select('#country');
//     var countryInput = countryElement.property("value");
//     console.log(countryInput);
//     console.log(sightings);
//     var filterByCountry = filteredReport.filter(getCountry => getCountry.country === countryInput);
//     console.log(filterByCountry);
//     return filterByCountry;
// }

// function filterShape(filteredReport) {
//     var shapeElement = d3.select('#shape');
//     var shapeInput = shapeElement.property("value");
//     console.log(shapeInput);
//     console.log(sightings);
//     var filterByShape = filteredReport.filter(getShape => getShape.shape === shapeInput);
//     console.log(filterByShape);
//     return filterByShape;
// }

// consolidating filtering for multiple user criteria
function filterAll(dataset) {
    var dateElement = d3.select('#datetime');
    // getting the value property of the input element when user clicks submit
    var dateInput = dateElement.property("value");
    // prints the value that was entered into the input form
    console.log(dateInput);
    // selecting the city element
    var cityElement = d3.select('#city');
    // capturing the user input for city
    var cityInput = cityElement.property("value");
    // converting the user input to upper case so that the filter works even if they enter text in lower or proper case
    cityInput = cityInput.toUpperCase();
    // prints the value entered into the form by the user
    console.log(cityInput);
    //rinse and repeat for remaining form fields
    var stateElement = d3.select('#state');
    var stateInput = stateElement.property("value");
    stateInput = stateInput.toUpperCase();
    console.log(stateInput);
    var countryElement = d3.select('#country');
    var countryInput = countryElement.property("value");
    countryInput = countryInput.toUpperCase();
    console.log(countryInput);
    var shapeElement = d3.select('#shape');
    var shapeInput = shapeElement.property("value");
    shapeInput = shapeInput.toUpperCase();
    console.log(shapeInput);

    // this section checks to see if the user input something into the form field. If not, it is skipped
    if (dateInput != "") {
        dataset = dataset.filter(getDates => getDates.datetime === dateInput);
        console.log(dataset);
    };
    if (cityInput != "") {
        dataset = dataset.filter(getCity => getCity.city === cityInput);
        console.log(dataset);
    };
    if (stateInput != "") {
        dataset = dataset.filter(getState => getState.state === stateInput);
    };
    if (countryInput != "") {
        dataset = dataset.filter(getCountry => getCountry.country === countryInput);
    };
    if (shapeInput != "") {
        dataset = dataset.filter(getShape => getShape.shape === shapeInput);
    };
    return dataset;

};

// updates the table
updateTable(sightings);
//complete the click handler for the form
submit.on("click", function() {
    d3.event.preventDefault();
    var result = filterAll(sightings); // invokes the dynamic filter function
    updateTable(result); // updates the results
});