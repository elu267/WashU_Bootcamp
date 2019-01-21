/* data route */
var url = '/metadata/';
var sampleURL = '/samples/';

// this function fetches teh metadata for a specific sample and displays
// it in the sample metadata panel section of the html page
// additionally, this function also uses the washing frequency (WFREQ)
// in the gauge visualization

function buildMetadata(sample) {
    // console.log(sample);

    // Use `d3.json` to fetch the metadata for a sample
    d3.json(url + sample).then(function(data) {
        console.log("I got the metadata:", data);
        updatePanel(data);

        // BONUS: Build the Gauge Chart buildGauge(data.WFREQ)

        /////////////////////////////////////////////////
        //          GAUGE CHART - this is so COOL!
        /////////////////////////////////////////////////

        var gaugeDiv = document.getElementById("gauge");
        // Enter a speed between 0 and 9
        var level = data['WFREQ'];

        // Trig to calc meter point
        var degrees = 9 - level + .5, // adding .5 so that the needle lands in the middle of the slice;
            radius = .5;
        var radians = degrees * Math.PI / 9;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Path: may have to change to create a better triangle
        var mainPath = 'M -.0125 -0.05 L .0 0.05 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX, space, pathY, pathEnd);

        var data = [{
                type: 'scatter',
                x: [0],
                y: [0],
                marker: { size: 28, color: '850000' },
                showlegend: false,
                name: 'speed',
                text: level,
                hoverinfo: 'text+name'
            },
            {
                values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50], // ADDED three
                rotation: 90,
                text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1'],
                textinfo: 'text',
                textposition: 'inside',
                marker: {
                    colors: ['rgba(14, 127, 0, .5)', 'rgba(54, 140, 11, .5)',
                        'rgba(110, 154, 22, .5)', 'rgba(170, 202, 42, .5)',
                        'rgba(202, 209, 95, .5)', 'rgba(210, 206, 145, .5)',
                        'rgba(232, 226, 202, .5)', 'rgba(245, 240, 222, .5)',
                        'rgba(252, 248, 238, .5)', 'rgba(255, 255, 255, 0)'
                        // ADDED three extra colors
                    ]
                },
                labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1'], // ADDED two (2) extra labels
                hoverinfo: 'label',
                hole: .5,
                type: 'pie',
                showlegend: false
            }
        ];

        var layout = {
            shapes: [{
                type: 'path',
                path: path,
                fillcolor: '850000',
                line: {
                    color: '850000'
                }
            }],
            title: '<b>Belly Button Washing Frequency</b> <br>Scrubs per Week ',
            height: 450,
            width: 450,
            xaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-1, 1]
            },
            yaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-1, 1]
            }
        };

        Plotly.newPlot(gaugeDiv, data, layout);
    });

    // Promise Pending
    const dataPromise = d3.json(url + sample);
    // console.log("Data Promise: ", dataPromise);
    // Use d3 to select the panel with id of `#sample-metadata`
    var metaPanel = d3.select("#sample-metadata");

    // this sub-function updates the content of the metadata panel for a given sample
    function updatePanel(dataset) {
        // console.log('I am inside the Update Panel routine.');
        // console.log(dataset);
        metaPanel.html(''); // Use `.html("") to clear any existing metadata
        Object.entries(dataset).forEach(([key, value]) => { // Use `Object.entries` to add each key and value pair to the panel
            var content = metaPanel.append('p');
            content.text(key + ":  " + value);
        });
    };
};


// this function builds the pie and bubble charts that are displayed on the webpage
function buildCharts(sample) {

    // @TODO: Use `d3.json` to fetch the sample data for the plots
    d3.json(sampleURL + sample).then(function(data) {
        console.log("I got the build charts data:", data);

        /////////////////////////////////////////////////
        //          BUBBLE CHART
        /////////////////////////////////////////////////
        var bubbleDiv = document.getElementById("bubble")
        var bubbleTrace = {
            x: data['otu_id'],
            y: data['sample_values'],
            mode: 'markers',
            text: data['otu_labels'],
            marker: {
                color: data['otu_id'],
                size: data['sample_values']
            }
        };

        var bubbleData = [bubbleTrace];

        var layout = {
            title: '<b>Biodiversity of Sample</b>',
            showlegend: false,
            height: 600,
            width: 1100
        };

        Plotly.newPlot(bubbleDiv, bubbleData, layout);

        /////////////////////////////////////////////////
        //          PIE CHART
        /////////////////////////////////////////////////
        var pieDiv = document.getElementById("pie");

        // setting up variables to hold each array
        var sample_values = data['sample_values'];
        var otu_ids = data['otu_id'];
        var otu_labels = data['otu_labels'];
        var zipped = [];

        // zipping the arrays together to keep arrays in sync
        for (var i = 0; i < sample_values.length; i++) {
            zipped.push({ sample_values: sample_values[i], otu_ids: otu_ids[i], otu_labels: otu_labels[i] });
        };

        // performing the sort on the sample values array
        zipped.sort(function(x, y) {
            return y.sample_values - x.sample_values;
        });

        // unzipping the arrays
        var unzip;
        for (i = 0; i < zipped.length; i++) {
            unzip = zipped[i];
            sample_values[i] = unzip.sample_values;
            otu_ids[i] = unzip.otu_ids;
            otu_labels[i] = unzip.otu_labels;
        };

        // console.log("sample_values: ", sample_values);
        // console.log("otu_ids: ", otu_ids);
        // console.log("otu_labels: ", otu_labels);

        var top_values = sample_values.slice(0, 10);
        // console.log(top_values);
        var pieTrace = {
            labels: data['otu_id'],
            values: top_values,
            hovertext: data['otu_labels'],
            type: 'pie'
        };

        var pieData = [pieTrace];

        var layout = {
            title: '<b>Top 10 Results</b>',
            height: 550,
            width: 550
        };

        Plotly.newPlot(pieDiv, pieData, layout);
    });
};

function dropDown() {
    var selector = d3.select("#selDataset");
    d3.json("/names").then((sampleNames) => {
        sampleNames.forEach((sample) => {
            selector.append("option").text(sample).property("value", sample);
        });
        // Use the first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });

};

function init() {
    dropDown();

};

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
};

// Initialize the dashboard
init();