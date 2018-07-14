let Blocnode = require('../src/Singleton.js');
let Module1 = Blocnode('ModuleOne');
Module1.Service('MyService', [
    function() {
        this.say = function() {
            console.log('Im a service in Module1');
        }
    }
]);