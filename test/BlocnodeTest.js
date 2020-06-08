const path     = require('path');
const assert   = require('assert');
const Blocnode = require('../src/Blocnode.js');

describe('Blocnode', function() {
    describe('Blocnode Class', function() {
        it('# namespace(namespace) : Should create namespace Object', function() {
            let Library = new Blocnode();
            class MyClass {}
            Library.namespace('My.Test.Path').MyClass = MyClass;

            assert.equal(Library.My.Test.Path.MyClass === MyClass, true);
        });

        it('# constructor(modulesPaths) : Should load module files', function() {
            let Library = new Blocnode([
                path.join(__dirname, './examples/ExampleFileOne.js'),
                path.join(__dirname, './examples/ExampleFileTwo.js')
            ]);

            assert(Library.Example.One.MyClassOne.say() === "MyClassOne", true);
            assert(Library.Example.Two.MyClassTwo.say() === "MyClassTwo", true);
        });
    });
});