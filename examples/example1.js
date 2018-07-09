let Blocnode = require('../src/Blocnode.js');
let App = new Blocnode('MyApp');

let Module1 = App.Module('ModuleOne');
Module1.Service('MyService', [
    function() {
        this.say = function() {
            console.log('Im a service in Module1');
        }
    }
]);

let Module2 = App.Module('ModuleTwo');
Module2.Controller('ModuleTwoCtrl', [
    'ModuleOne.Services.MyService',
    function(MyService) {
        this.useToSay = function() {
            MyService.say();
        }
    }
]);

let Module3 = App.Module('ModuleThree');
Module3.Service('MyListener', [
    'ModuleTwo.Controllers.ModuleTwoCtrl',
    function(ModuleTwoCtrl) {
        setInterval(function() {
            ModuleTwoCtrl.useToSay();
        }, 5000);
    }
]);

console.log(App);
