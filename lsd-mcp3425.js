'use strict';

var i2c = require('i2c');
var sleep = require('sleep');

class mcp3425 {
    sint16(byte0, byte1) {
	var res = (byte1 << 8) + byte0;
	if ((res & 0x8000) == 0x8000) {
	    res = res - 0x10000;
	}
	return res;
    }
    
    constructor(addr, device) {
	this.wire = new i2c(addr, {device: device});
	this.first = true;
	this.init(12, 1);
    }

    init(bits, gain) {
	if (bits != 12 && bits != 14 && bits != 16) {
	    bits = 12;
	}
	if (gain != 1 && gain != 2 && gain != 4 && gain != 8) {
	    gain = 1;
	}
	var gain_bits = 0x00;
	if (gain == 2) {
	    gain_bits = 0x01;
	}
	else if (gain == 4) {
	    gain_bits = 0x02;
	}
	else if (gain == 8) {
	    gain_bits = 0x03;
	}
	this.command = 0x80 | gain_bits;
	this.delay = 5;
	this.gain = 1000.0 * gain;
	if (bits == 14) {
	    this.command = 0x84 | gain_bits;
	    this.delay = 17;
	    this.gain = 4000.0 * gain;
	}
	else if (bits == 16) {
	    this.command = 0x88 | gain_bits;
	    this.delay = 67;
	    this.gain = 16000.0 * gain;
	}
    }

    async_get_voltage(callback) {
	this.wire.write([this.command], (err) => {});
	sleep.msleep(this.delay);
	this.wire.read(2, (err, res) => {
	    var v = this.sint16(res[1], res[0]) / this.gain;
	    callback(null, {"voltage":v});
	});
    }
}

module.exports = mcp3425;
