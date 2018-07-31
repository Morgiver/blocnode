const Blocnode = require('./Blocnode.js');

let instance;

function Singleton(name) {
    this.createApplicationInstance = function(name) {
        instance = new Blocnode(name);
        return instance;
    };

    this.createModuleInstance = function(name) {
        return instance.$module(name);
    };

    this.getInstance = function(name) {
        if(instance !== undefined) {
            if(instance.$name === name) return instance;
            else return this.createModuleInstance(name);
        }
        else return this.createApplicationInstance(name);
    };

    return this.getInstance(name);
}

module.exports = Singleton;