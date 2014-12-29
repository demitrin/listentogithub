var socket = require("socket.io-client")("http://localhost:3000");
var d3 = require('d3');
var $ = require('jquery-browserify');
var theSvg;


var processNewData = function(newData) {
    var bubbles = theSvg.selectAll(".bubble").data(newData, function(d, i) {
        return d.id;    
    });
    var bubbleGroup = bubbles
                        .enter().append("g")
                            .attr("transform", function(d, i) {
                                  return "translate(" + Math.random() * 500 + 
                                  "," + Math.random() * 500 + ")";
                            })
                            .attr("class", "bubble");
    bubbleGroup.append("circle")
        .attr("r", 20);
    bubbleGroup.append("text")
        .text(function(d, i) {
            if(d.commits == 1) {
                return d.user + ' pushed "' + d.commitMessages[0].message + '" to ' + d.repository;
            } else {
                var lastIndex = d.commitMessages.length - 1; 
                return d.user + ' pushed "' + d.commitMessages[lastIndex].message + '" and ' +
                    (d.commits - 1) + " other commits to " + d.repository;
            }
        });
    bubbles
        .exit().transition()
            .duration(5000)
            .style("opacity", 0)
            .remove();
};

var initializeSocket = function() {
    socket.on("github payload", function(data) {
        console.log(data);
        processNewData(data);
    });
};

var initialize = function() {
    theSvg = d3.select("#the-svg")
        .attr("width", 800)
        .attr("height", 600);
    initializeSocket();
    
};

$(document).ready(function() {
    console.log("ready to go");
    initialize();

});
