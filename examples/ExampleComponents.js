const Blocnode = require('../src/Singleton.js');
const App      = Blocnode('MyApp');

App.$function('RandomRoad.MyFunction', [
    function(name) {
        console.log(`My name is ${name}`);
    }
]);

App.$class('AnOtherRoad.MyClass', [
    'RandomRoad.MyFunction',
    function MyClass(MyFunction, name) {
        this.myname = name;
        this.sayIt = function() {
            MyFunction(this.myname);
        }
    }
]);

App.$instance('ExampleRoadTo.MyInstance', [
    'AnOtherRoad.MyClass',
    function MyInstance(MyClass) {
        let newClass = new MyClass('Morgiver');
        newClass.sayIt();
    }
]);

App.$bootstrap();
console.log(App);