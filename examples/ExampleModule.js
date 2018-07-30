const Blocnode = require('../src/Singleton.js');
const App      = Blocnode('MyApp');

App.$instance('MyAppInstance', [
    'MyModule.MyModuleClass',
    function MyAppInstance(ModuleClass) {
        let myArray = [];
        myArray.push(new ModuleClass('Albert'));
        myArray.push(new ModuleClass('Fredo'));
        myArray.push(new ModuleClass('Babar'));

        for(let i in myArray) {
            myArray[i].say();
        }
    }
]);

const Module = Blocnode('MyModule');

Module.$class('MyInnerClass', [
    function() {
        this.pouet = "pouet";
    }
]);

Module.$class('MyModuleClass', [
    'MyModule.MyInnerClass',
    function MyModuleClass(MyInnerClass, name) {
        console.log(new MyInnerClass());
        this.name = name;
        this.say = function() {
            console.log(`Hello ! My name is  ${this.name} and i'm in Module`);
        }
    }
]);

App.$bootstrap();