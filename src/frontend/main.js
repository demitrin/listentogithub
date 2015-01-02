var socket = require("socket.io-client")("http://localhost:3000");
var d3 = require('d3');
var $ = require('jquery-browserify');
var theSvg;
var theState = {};

// Create d3 elements for incoming data.
var processNewData = function(newData) {
    var bubbles = theSvg.selectAll(".bubble").data(newData, function(d, i) {
        return d.id;    
    });
    var bubbleGroup = bubbles
                        .enter().append("g")
                            .attr("transform", function(d, i) {
                                  return "translate(" + Math.random() * theState.width + 
                                  "," + Math.random() * theState.height + ")";
                            })
                            .attr("class", "bubble");
    bubbleGroup.append("circle")
        .attr("r", 20)
        .attr("fill", "#BAC8D9");

    // Static text.
    var bubbleText = bubbleGroup.append("g")
            .attr("class", "hover");
    bubbleText
        .append("text")
            .attr("fill", "#f2f2f2")
            .attr("x", 0)
            .attr("text-anchor", "middle")
            .text(function(d, i) {
                return d.user + " pushed to " + d.repository;
            });
    // Fade text out.
    bubbleText.transition()
        .delay(1000)
        .duration(1000)
        .style("opacity", 0)
        .each("end", function() {
            d3.select(this).attr("display", "none");
        });

    // Hover text.
    bubbleGroup.append("g")
            .attr("class", "hover")
            .attr("display", "none")
        .append("text")
            .attr("y", "2em")
            .attr("text-anchor", "middle")
            .attr("x", 0)
            .attr("fill", "#f2f2f2")
            .text(function(d, i) {
                if(d.commits === 0) {
                    return "";
                } else if(d.commits == 1) {
                    return '"' + d.commitMessages[0].message + '"';
                } else {
                    var lastIndex = d.commitMessages.length - 1; 
                    return '"' + d.commitMessages[lastIndex].message + '" and ' + 
                        d.commits + " other commits.";
                }
            });
    
    // Handle mouse events.
    bubbleGroup.on("mouseover", function() {
        d3.select(this).selectAll(".hover")
            .attr("display", "inline")
            .style("opacity", 1);
        console.log(this);
    });
    bubbleGroup.on("mouseout", function() {
        d3.select(this).selectAll(".hover").attr("display", "none");
        console.log(this);
    });
    
    // Remove stale bubbles
    /*
    bubbleGroup.transition()
        .delay(5000)
        .duration(1000)
        .style("opacity", 0)
        .remove();
    */
};

var initializeSocket = function() {
    socket.on("github payload", function(data) {
        processNewData(data);
    });
};

var updateHeight = function() {
    var contentHeight = window.innerHeight - document.getElementById("header").style.height;
    theState.height = contentHeight;
    theState.width = window.innerWidth;
    document.getElementById("content").style.height = theState.height;
    theSvg = d3.select("#the-svg")
        .attr("height", theState.height)
        .attr("width", theState.width);
};

var initialize = function() {
    $(window).resize(updateHeight);
    updateHeight();
    initializeSocket();
};

$(document).ready(function() {
    console.log("ready to go");
    initialize();
});
