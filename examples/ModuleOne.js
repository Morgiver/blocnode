let Blocnode = require('../src/Singleton.js');
let ModuleOne = Blocnode('ModuleOne');
ModuleOne.Service('MyService', [
    function() {
        this.say = function() {
            console.log('Im a service in Module1');
        }
    }
]);