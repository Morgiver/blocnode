
const Blocnode = require('../../src/Blocnode.js');

let App = new Blocnode();

App.main(__dirname).then(() => {
    App.log('Quitting...');
}).catch((e) => App.log(e));
