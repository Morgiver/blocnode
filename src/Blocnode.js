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
 * @returns {Blocnode}
 * @constructor
 */
Blocnode.prototype.Module = function(namespace) {
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
 * @constructor
 */
Blocnode.prototype.Require = function(namespace) {
    let ns   = namespace.split(".");
    let root = null;
    if(ns[0] === this.name) root = this;
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
 * @constructor
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
 * @constructor
 */
Blocnode.prototype.Controller = function(name, requires) {
    name = `Controllers.${name}`;
    this.Inject(name, requires);
};

/**
 * Service
 * @param name
 * @param requires
 * @constructor
 */
Blocnode.prototype.Service = function(name, requires) {
    name = `Services.${name}`;
    this.Inject(name, requires);
};

/**
 * Factory
 * @param name
 * @param requires
 * @constructor
 */
Blocnode.prototype.Factory = function(name, requires) {
    name = `Factories.${name}`;
    this.Inject(name, requires, 'class');
};

module.exports = Blocnode;
