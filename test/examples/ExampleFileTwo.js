module.exports = (function(Library = new (require('../../src/Blocnode.js'))()) {
    class MyClassTwo {
        static say() { return "MyClassTwo" }
    }
    Library.namespace('Example.Two').MyClassTwo = MyClassTwo;

    return Library;
});