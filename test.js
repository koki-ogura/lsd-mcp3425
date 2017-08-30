//'use strict';

var sleep = require('sleep');
var async = require('async');
var MCP3425 = require('./lsd-mcp3425');

var mcp3425 = new MCP3425(0x68, '/dev/i2c-2');
mcp3425.init(16, 1);

async.forever(
    (callback) => {
	mcp3425.async_get_voltage((err, res) => {
	    console.log(res);
	    sleep.msleep(1000);
	    callback(null);
	});
    }
);
