let Blocnode = require('../src/Singleton.js');
let App = Blocnode('MyApp');

require('./ModuleOne');
require('./ModuleTwo');
require('./ModuleThree');

console.log(App);