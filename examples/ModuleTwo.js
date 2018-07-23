let Blocnode = require('../src/Singleton.js');
let ModuleTwo = Blocnode('ModuleTwo', ['ModuleOne']);
ModuleTwo.Controller('ModuleTwoCtrl', [
    'ModuleOne.Services.MyService',
    function(MyService) {
        this.useToSay = function() {
            MyService.say();
        }
    }
]);