let Blocnode = require('../src/Singleton.js');
let Module2 = Blocnode('ModuleTwo');
Module2.Controller('ModuleTwoCtrl', [
    'ModuleOne.Services.MyService',
    function(MyService) {
        this.useToSay = function() {
            MyService.say();
        }
    }
]);