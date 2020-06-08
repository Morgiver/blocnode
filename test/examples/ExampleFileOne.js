module.exports = (function(Library = new (require('../../src/Blocnode.js'))()) {
    class MyClassOne {
        static say() { return "MyClassOne"; }
    }
    Library.namespace('Example.One').MyClassOne = MyClassOne;

    return Library
});