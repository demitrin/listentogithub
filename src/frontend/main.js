var socket = require("socket.io-client")("http://localhost:3000");
var d3 = require('d3');
var $ = require('jquery-browserify');
var theSvg;


var processNewData = function(newData) {
    var bubbles = theSvg.data(newData);
    bubbles
        .enter().append("circle")
            .attr("cx", Math.random() * 500)
            .attr("cy", Math.random() * 500)
            .attr("r", 20);
    bubbles
        .exit().transition()
            .duration(500)
            .style("opacity", 1e-6)
            .remove();
};

var initializeSocket = function() {
    socket.on("github payload", function(data) {
    /*
    var p = document.createElement("p");
    p.innerText = JSON.stringify(data);
    document.body.appendChild(p);
    */
        processNewData(data);
    });

};

var initialize = function() {
    theSvg = d3.select("#the-svg");
    initializeSocket();
    
};

$(document).ready(function() {
    console.log("ready to go");
    initialize();

});
