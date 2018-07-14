let Blocnode = require('../src/Singleton.js'); //
let App = Blocnode('MyApp');

require('./Module1');
require('./Module2');
require('./Module3');

console.log(App);