var socket = require("socket.io-client")("http://localhost:3000");
socket.on("github payload", function(data) {
   var p = document.createElement("p");
   p.innerText = JSON.stringify(data);
   document.body.appendChild(p);
});
console.log('asdfkjs');
