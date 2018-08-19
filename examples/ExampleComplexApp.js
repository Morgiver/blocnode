const Blocnode = require('../src/Singleton.js');
const App      = Blocnode('MyApp');

App.$instance('Logger', [
    function() {
        this.log = function(message) {
            console.log(message);
        }
    }
]);

App.$instance('System', [
    'MyApp.Logger',
    function(Logger) {
        this.say = function(message) {
            Logger.log(message)
        }
    }
]);

App.$instance('Component', [
    'MyApp.System',
    function(System) {
        System.say(`I'm logger and i have the greater priority requirement loading`);
    }
]);

App.$bootstrap();
console.log(App);