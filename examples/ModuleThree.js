let Blocnode = require('../src/Singleton.js');
let ModuleThree = Blocnode('ModuleThree', ['ModuleOne', 'ModuleTwo']);
ModuleThree.Service('MyListener', [
    'ModuleTwo.Controllers.ModuleTwoCtrl',
    function(ModuleTwoCtrl) {
        setInterval(function() {
            ModuleTwoCtrl.useToSay();
        }, 5000);
    }
]);