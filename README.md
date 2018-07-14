# Blocnode
Blocnode is a simple library helping me to organize, structure and modulate my code.
Every Module is added in the app can use the other module present in the app with a simple require call.

Actual version 0.0.12

There's an example in one file:
```Javascript

let Blocnode = require('blocnode');
let App = Blocnode('MyApp');

let Module1 = Blocnode('ModuleOne');
Module1.Service('MyService', [
    function() {
        this.say = function() {
            console.log('Im a service in Module1');
        }
    }
]);

let Module2 = Blocnode('ModuleTwo');
Module2.Controller('ModuleTwoCtrl', [
    'ModuleOne.Services.MyService',
    function(MyService) {
        this.useToSay = function() {
            MyService.say();
        }
    }
]);

let Module3 = Blocnode('ModuleThree');
Module3.Service('MyListener', [
    'ModuleTwo.Controllers.ModuleTwoCtrl',
    function(ModuleTwoCtrl) {
        setInterval(function() {
            ModuleTwoCtrl.useToSay();
        }, 5000);
    }
]);

```

I could use those 3 modules in separate files, or node module like that :

#### Module1.js :
```Javascript
let Blocnode = require('blocnode');
let Module1 = Blocnode('ModuleOne');
Module1.Service('MyService', [
    function() {
        this.say = function() {
            console.log('Im a service in Module1');
        }
    }
]);
```
#### Module2.js :
```Javascript
let Blocnode = require('blocnode');
let Module2 = Blocnode('ModuleTwo');
Module2.Controller('ModuleTwoCtrl', [
    'ModuleOne.Services.MyService',
    function(MyService) {
        this.useToSay = function() {
            MyService.say();
        }
    }
]);
```
#### Module3.js :
```Javascript
let Blocnode = require('blocnode');
let Module3 = Blocnode('ModuleThree');
Module3.Service('MyListener', [
    'ModuleTwo.Controllers.ModuleTwoCtrl',
    function(ModuleTwoCtrl) {
        setInterval(function() {
            ModuleTwoCtrl.useToSay();
        }, 5000);
    }
]);
```
#### Application.js :
```Javascript
let Blocnode = require('blocnode');
let App = Blocnode('MyApp');

require('./Module1');
require('./Module2');
require('./Module3');

console.log(App);
```

In this case your main application file is the loader of multiple module that you need.

## Reusability
When you use multiple files, you can use now your module as the main app file if you want.