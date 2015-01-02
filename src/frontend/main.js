var socket = require("socket.io-client")("http://localhost:3000");
var d3 = require('d3');
var $ = require('jquery-browserify');
var theSvg;
var theState = {};
var textWidth = 250;

// Move to front method courtesy of https://gist.github.com/trtg/3922684
d3.selection.prototype.moveToFront = function() {
    console.log(this);
    return this.each(function(){
        this.parentNode.appendChild(this);
    });
};

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
            //.attr("fill", "#6889a6")
            .attr("font-weight", "bold")
            .attr("fill", "#f2f2f2")
            .attr("x", 0)
            .attr("y", "-1em")
            .attr("dy", 0)
            .attr("text-anchor", "middle")
            .text(function(d, i) {
                return d.user + " pushed to " + d.repository;
            })
            .call(wrap, textWidth);
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
            .attr("dy", 0)
            .attr("text-anchor", "middle")
            .attr("font-weight", "bold")
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
            })
            .call(wrap, textWidth);
    
    // Handle mouse events.
    bubbleGroup.on("mouseover", function(d, i) {
        var thisSelection = d3.select(this).moveToFront();
        thisSelection.selectAll(".hover")
            .attr("display", "inline")
            .style("opacity", 1);
    });
    bubbleGroup.on("mouseout", function() {
        d3.select(this).selectAll(".hover").attr("display", "none");
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

function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}

$(document).ready(function() {
    console.log("ready to go");
    initialize();
});
