/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting
//Type Node.js Here :)

var B = 3975;
var mraa = require("mraa");

var myAnalogPin = new mraa.Aio(0);
var a = 0;
var celsius_temperature=5.5;
var fahrenheit_temperature=5.5;
var fs = require("fs");
setInterval(function(){
a = myAnalogPin.read();
//console.log("Analog Pin (A0) Output: " + a);
//console.log("Checking....");

var log = fs.openSync("/media/sdcard/test.csv",'a');

var resistance = (1023 - a) * 10000 / a; //get the resistance of the sensor;
//console.log("Resistance: "+resistance);
celsius_temperature = 1 / (Math.log(resistance / 10000) / B + 1 / 298.15) - 273.15;//convert to temperature via datasheet ;
//console.log("Celsius Temperature "+celsius_temperature); 
fahrenheit_temperature = (celsius_temperature * (9 / 5)) + 32;
var epoch = new Date();
var buf= epoch.getHours() + "," + epoch.getMinutes() + "," + epoch.getSeconds() + "," + epoch.getDate() + "," + epoch.getMonth() + "," + epoch.getYear() + "," + celsius_temperature.toFixed(2) + "\n";
fs.writeSync(log, buf);
console.log("Fahrenheit Temperature: " + fahrenheit_temperature);
console.log("Celsius temperature: "+celsius_temperature);
fs.closeSync(log);
},5000);

var http = require("http");
http.createServer(function(request,response){
    response.writeHead(200,{'Content-Type':'text/plain'});
    response.end("Sensor reading: " + a + "\nCelsius temperature: " + celsius_temperature + "\nFahrenheit temperature: " + fahrenheit_temperature);
}).listen(8080);
console.log('Server running at http://192.168.2.15:8080/');