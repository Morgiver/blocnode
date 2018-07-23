let Blocnode = require('../src/Singleton.js');
let App = Blocnode('MyApp');

/**
 * Creating the Concrete Class
 */
App.ConcreteClass('MyConcreteClass', [
    function(name) {
        this.name = name;
        this.say = function() {
            console.log(`My name is ${this.name}`);
        }
    }
]);

/**
 * Creating the Factory of Concrete Class
 */
App.Factory('MyConcreteClassFactory', [
    'ConcreteClass.MyConcreteClass',
    function(MyConcreteClass) {
        this.create = function(name) {
            return new MyConcreteClass(name);
        };
    }
]);

/**
 * Using the Factory
 */
App.Controller('TestCtrl', [
    'Factories.MyConcreteClassFactory',
    function(MyConcreteClassFactory) {
        let me = MyConcreteClassFactory.create('Morgiver');
        let he = MyConcreteClassFactory.create('Albert');
        me.say();
        he.say();
    }
]);

console.log(App);