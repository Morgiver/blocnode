let Blocnode = require('../src/Singleton.js');
let App = Blocnode('MyApp');

let Module1 = Blocnode('ModuleOne');
Module1.Service('MyService', [
    function() {
        this.say = function() {
            console.log('Im a service in Module1');
        }
    }
]);

let Module2 = Blocnode('ModuleTwo');
Module2.Controller('ModuleTwoCtrl', [
    'ModuleOne.Services.MyService',
    function(MyService) {
        this.useToSay = function() {
            MyService.say();
        }
    }
]);

let Module3 = Blocnode('ModuleThree');
Module3.Service('MyListener', [
    'ModuleTwo.Controllers.ModuleTwoCtrl',
    function(ModuleTwoCtrl) {
        setInterval(function() {
            ModuleTwoCtrl.useToSay();
        }, 5000);
    }
]);

console.log(App);
