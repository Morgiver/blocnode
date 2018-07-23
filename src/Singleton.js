const Blocnode = require('./Blocnode.js');

let instance;

function Singleton(name, dependencies) {
    this.createApplicationInstance = function(name) {
        instance = new Blocnode(name);
        return instance;
    };

    this.createModuleInstance = function(name, dependencies) {
        return instance.Module(name, dependencies);
    };

    this.getInstance = function(name, dependencies) {
        if(instance !== undefined) return this.createModuleInstance(name, dependencies);
        else return this.createApplicationInstance(name);
    };

    return this.getInstance(name, dependencies);
}

module.exports = Singleton;