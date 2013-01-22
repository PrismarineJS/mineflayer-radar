# mineflayer-radar

A plugin to give you a web-based radar interface to your mineflayer bot.

See [https://github.com/superjoe30/mineflayer/](https://github.com/superjoe30/mineflayer/)

YouTube Demo: none

## Screenshot

none

## Usage

```js
var mineflayer = require('mineflayer');
var radarPlugin = require('mineflayer-radar')(mineflayer);
var bot = mineflayer.createBot({ username: 'Player' });
var options = {
  host: '0.0.0.0', // optional
  port: 0,         // optional
}
// install the plugin
radarPlugin(bot, options);
```

This will print "Listening at [URL]" to the console. Use a web browser with
that URL to see the radar.
