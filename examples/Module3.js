let Blocnode = require('../src/Singleton.js');
let Module3 = Blocnode('ModuleThree');
Module3.Service('MyListener', [
    'ModuleTwo.Controllers.ModuleTwoCtrl',
    function(ModuleTwoCtrl) {
        setInterval(function() {
            ModuleTwoCtrl.useToSay();
        }, 5000);
    }
]);