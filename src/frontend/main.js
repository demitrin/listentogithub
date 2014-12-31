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
        .attr("r", 20)
        .attr("fill", "#BAC8D9");
    bubbleGroup.append("text")
        .attr("fill", "#f2f2f2")
        .attr("x", 0)
        .attr("text-anchor", "middle")
        .text(function(d, i) {
            return d.user + " pushed to " + d.repository;
        });
    bubbleGroup.append("g")
        .attr("class", "hover")
            .attr("display", "none")
        .append("text")
            .attr("y", "2em")
            .attr("text-anchor", "middle")
            .attr("x", 0)
            .attr("fill", "#f2f2f2")
            .text(function(d, i) {
                if(d.commits == 1) {
                    return '"' + d.commitMessages[0].message + '"';
                } else {
                    var lastIndex = d.commitMessages.length - 1; 
                    return '"' + d.commitMessages[lastIndex].message + '" and ' + 
                        d.commits + " other commits.";

                }
            });
    bubbleGroup.on("mouseover", function() {
        d3.select(this).select(".hover").attr("display", "inline");
    });
    bubbleGroup.on("mouseout", function() {
        d3.select(this).select(".hover").attr("display", "none");
    });
    bubbleGroup.transition()
        .delay(5000)
        .duration(1000)
        .style("opacity", 0)
        .remove();
};

var initializeSocket = function() {
    socket.on("github payload", function(data) {
        console.log(data);
        processNewData(data);
    });
};

var updateHeight = function() {
    var contentHeight = window.innerHeight - document.getElementById("header").style.height;
    document.getElementById("content").style.height = contentHeight;
    theSvg = d3.select("#the-svg")
        .attr("height", contentHeight)
        .attr("width", window.innerWidth);
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
