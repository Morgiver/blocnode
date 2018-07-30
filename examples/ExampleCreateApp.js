process.env.dev = true;

const Blocnode = require('../src/Singleton.js');
const App      = Blocnode('MyApp');

App.$instance('Http', [
    function Http() {
        this.interval = null;

        this.start = function(sec) {
            this.interval = setInterval(function() {
                console.log(`Je suis un serveur qui écoute`);
            }, sec);
        };

        this.stop = function() {
            clearInterval(this.interval);
        };
    }
]);

App.$function('startServer', [
    'Http',
    function(Http, seconde) {
        Http.start(seconde);
    }
]);

App.$bootstrap();
console.log(App);
App.startServer(5000);