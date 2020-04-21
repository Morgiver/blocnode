
const Blocnode = require('../../src/Blocnode.js');
const path     = require('path');

let App = new Blocnode();

App.main(__dirname, path.join(__dirname, './Blocs')).then(() => {
    App.log('Quitting...');
}).catch((e) => App.log(e));
