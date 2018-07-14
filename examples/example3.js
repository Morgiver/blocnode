let Blocnode = require('../src/Singleton.js'); //
let App = Blocnode('MyApp');

App.Factory('TestFactory', [
    function(name) {
        this.name = name;
        this.say = function() {
            console.log(`My name is ${this.name}`);
        }
    }
]);

App.Controller('TestCtrl', [
    'Factories.TestFactory',
    function(TestFactory) {
        let me = new TestFactory('Morgiver');
        me.say();
    }
]);

console.log(App);