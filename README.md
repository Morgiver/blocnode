# Blocnode
Blocnode is a little library constructor that help dev to organise there 
code in a namespaced library.

The idea is to have a full namespace in our application and make loading
module very simple. In other way it's also possible to use the module in
a standalone mode with the proper code.

## Creating the namespace
```Javascript
// Creating the bloc
let Library = new Blocnode();
// Creating a class to include
class MyClass {}
// Include the class
Library.namespace('My.Test.Path').MyClass = MyClass;
```

## Creating a module
In FileOne.js :
```Javascript
/**
 * When creating a module, be sure to have the library in parameter.
 * An empty lib or an instance already declared
 */
module.exports = (function(Library = new (require('blocnode'))()) {
    // Creating a class to include
    class MyClass {}
    // Include the class
    Library.namespace('My.Test.Path').MyClass = MyClass;
    // Creating a value like constant or variable
    const MyConstant = "My Beautifull CONST";
    // Include the value
    Library.namespace('My.Test.Path').MyConst = MyConstant;
 
    return Library;
});
```

In index.js
```Javascript
// Creating the new Library and including the modules in it.
let Blocnode = new (require('blocnode'))([
    './FileOne.js',
    'my-node-module-npm-name'
]);

// expecting : My Beautifull CONST
console.log(Blocnode.My.Test.Path.MyConst);
```
### In standalone
If you just want to use your module in stand alone mode, you can use it like
this :

In standalone.js
```Javascript
// Creating the new Library and including the modules in it.
let MyModule = (require('./FileOne.js'))();
// expecting : My Beautifull CONST
console.log(MyModule.My.Test.Path.MyConst);
```

### Note:
When creating a module, because module are loaded one by one, if you
call a module not loaded, inside in the private's module context, you will 
have undefined error.

Use the private's module context to set it up or make operation that don't
need the Library.

 ```Javascript
 /**
  * When creating a module, be sure to have the library in parameter.
  * An empty lib or an instance already declared
  */
 module.exports = (function(Library = new (require('blocnode'))()) {
     /**
      * Here is the private context, the entire Library is not loaded
      */
     console.log(Library.My.Not.Loaded.Module);

     class MyClass {
        constructor() {
            /**
             * Here the context of MyClass. When you instanciate it,
             * all module are loaded, so you can use the entire Library
             */
            console.log(Library.My.Loaded.Module);
        }
     }

     Library.namespace('My.Test.Path').MyClass = MyClass;

     return Library;
 });
 ```

