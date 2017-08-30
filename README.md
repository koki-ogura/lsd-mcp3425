# lsd-mcp3425
mcp3425 adc module for node.js (node-red)

## general install
```
# npm -g install lsd-mcp3425
```

## test program
```test.js
var sleep = require('sleep');
var async = require('async');
var MCP3425 = require('lsd-mcp3425');

var mcp3425 = new MCP3425(0x68, '/dev/i2c-2');
// init(bits, gain)
// bits = 12, 14, 16
// gain = 1, 2, 4, 8
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
```

## setup for node-red
edit /root/.node-red/settings.js

```
    functionGlobalContext: {
        mcp3425:require('lsd-mcp3425')
        // os:require('os'),
        // octalbonescript:require('octalbonescript'),
        // jfive:require("johnny-five"),
        // j5board:require("johnny-five").Board({repl:false})
    },
```

and Reboot

```
# reboot
```

## node-red's function
```node.js
var mcp3425 = context.get('mcp3425');
if (!mcp3425) {
    var MCP3425 = global.get('mcp3425');
    context.set(
        'mcp3425',
        new MCP3425(0x68, '/dev/i2c-2')
    );
    mcp3425 = context.get('mcp3425');
    mcp3425.init(16, 1);
}
mcp3425.async_get_voltage((err, res) => {
    var msg = {}
    msg.payload = res;
    node.send(msg);
})
return null;
```

