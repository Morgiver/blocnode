/**
 * Blocnode Class
 * @param name
 * @param root
 * @constructor
 */
function Blocnode(name, root) {
    this.name = name;
    this.root = root || this;
}

/**
 * Module
 * @param namespace
 * @param dependencies[]
 * @returns {Blocnode}
 */
Blocnode.prototype.Module = function(namespace, dependencies) {
    let undefinedDependencies = false;

    for(let i in dependencies) {
        if(!this.root[dependencies[i]]) {
            undefinedDependencies = true;
            console.log(`Dependencie ${dependencies[i]} undefined`);
        }
    }

    if(undefinedDependencies) console.log(new Error(`Some dependencies are undefined`));
    else return this.InjectModule(namespace);
};

/**
 * InjectModule
 * @param namespace
 * @returns {Blocnode}
 */
Blocnode.prototype.InjectModule = function(namespace) {
    let ns = namespace.split(".");
    let root = this;

    for(let i in ns) {
        root[ns[i]] = root[ns[i]] || new Blocnode(ns[i], this.root);
        root = root[ns[i]];
    }

    return root;
};

/**
 * Require
 * @param namespace
 * @returns {*|Blocnode}
 */
Blocnode.prototype.Require = function(namespace) {
    let ns   = namespace.split(".");
    let root = null;
    if(ns[0] === this.name) {
        root = this;
        ns.shift();
    }
    else root = this.root;

    for(let i in ns) {
        root = root[ns[i]];
    }

    return root;
};

/**
 * Inject
 * @param name
 * @param requires
 */
Blocnode.prototype.Inject = function(namespace, requires, type = 'instance') {
    let fn = requires[requires.length - 1];
    requires.pop();

    let params = [];
    for(let i in requires) {
        params.push(this.Require(requires[i]));
    }

    let ns = namespace.split('.');
    let root = this;

    for(let i in ns) {
        if(i < ns.length - 1) {
            root[ns[i]] = root[ns[i]] || {};
            root = root[ns[i]];
        }
        else {
            if(type === 'instance') root[ns[i]] = new fn(...params);
            else root[ns[i]] = fn;
        }
    }
};

/**
 * Controller
 * @param name
 * @param requires
 */
Blocnode.prototype.Controller = function(name, requires) {
    name = `Controllers.${name}`;
    this.Inject(name, requires);
};

/**
 * Service
 * @param name
 * @param requires
 */
Blocnode.prototype.Service = function(name, requires) {
    name = `Services.${name}`;
    this.Inject(name, requires);
};

/**
 * Factory
 * @param name
 * @param requires
 */
Blocnode.prototype.Factory = function(name, requires) {
    name = `Factories.${name}`;
    this.Inject(name, requires);
};

/**
 * AbstractClass
 * @param name
 * @param requires
 */
Blocnode.prototype.AbstractClass = function(name, requires) {
    name = `AbstractClass.${name}`;
    this.Inject(name, requires, 'class');
};

/**
 * ConcreteClass
 * @param name
 * @param requires
 */
Blocnode.prototype.ConcreteClass = function(name, requires) {
    name = `ConcreteClass.${name}`;
    this.Inject(name, requires, 'class');
};

module.exports = Blocnode;
