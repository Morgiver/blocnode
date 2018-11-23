/**
 * Blocnode Class
 * @param name
 * @param root
 * @constructor
 */
function Blocnode(name, root) {
    this.$name       = name;
    this.$root       = root || this;
    this.$components = [];
}

/**
 * $logger
 * @param message
 */
Blocnode.prototype.$logger = function(message) {
    if(process.env.dev) console.log(message);
};

/**
 * $browsComponentRequirements
 * @param component
 */
Blocnode.prototype.$browseComponentRequirements = function(component) {
    if(typeof component === 'string') {
        for(let i in this.$components) {
            if(component === this.$components[i].namespace) {
                component = this.$components[i];
                break;
            }
        }
    }

    for(let j in component.requires) {
        let requirement = component.requires[j];
        if(typeof requirement == 'string') {
            this.$browseComponentRequirements(requirement);
            this.$addPriorityPoint(requirement);
        }
    }
};

/**
 * $addPriorityPoint
 * @param namespace
 */
Blocnode.prototype.$addPriorityPoint = function(namespace) {
    for(let k in this.$components) {
        if(namespace === this.$components[k].namespace) {
            this.$components[k].priority++;
        }
    }
};

/**
 * $dropComponent
 */
Blocnode.prototype.$dropComponent = function(namespace) {
    for(let i in this.$root.$components) {
        if(namespace === this.$root.$components[i].namespace) {
            this.$root.$components.splice(i, 1);
            break;
        }
    }

    let parts = namespace.split('.');
    let root = this.$root;

    for(let i in parts) {
        if(i == parts.length - 1) {
            delete root[parts[i]];
        } else {
            root = root[parts[i]];
        }
    }
};

/**
 * $setPriorityComponents
 */
Blocnode.prototype.$setPriorityComponents = function() {
    for(let i in this.$components) {
        this.$browseComponentRequirements(this.$components[i]);
    }

    this.$components.sort(function(a, b) {
        return b.priority - a.priority;
    });
};

/**
 * $bootstrap
 * @description Browser all component waiting to be injected and give a note on every component to know the order of
 *              injection.
 */
Blocnode.prototype.$bootstrap = function() {
    /**
     * Set Priority
     */
    this.$setPriorityComponents();
    for(let i in this.$components) {
        this.$inject(this.$components[i].namespace, this.$components[i].type, this.$components[i].requires);
    }
};

/**
 * $module
 * @param namespace
 * @returns {Blocnode}
 */
Blocnode.prototype.$module = function(namespace) {
    /**
     * Splitting namespace
     */
    let parts = namespace.split('.');
    let ns = this;

    /**
     * Creating the new module and injecting hes components
     */
    for(let i in parts) {
        ns[parts[i]] = ns[parts[i]] || new Blocnode(parts[i], this.$root);
        ns = ns[parts[i]];
    }

    return ns;
};

/**
 * $_addComponent
 * @param type
 * @param namespace
 * @param opt
 * @param requires
 */
Blocnode.prototype.$_addComponent = function(type, namespace, requires) {
    /**
     * Add name of module in namespace
     * @type {string}
     */
    namespace = `${this.$name}.${namespace}`;

    /**
     * Adding the new components in components array to be injected on $bootstrap() call
     * If the another component has the same namespace it will be overwritten
     */
    let newComponent = {
        type: type,
        namespace: namespace,
        requires: requires,
        priority: 0
    };

    let isExist = undefined;
    for(let i in this.$root.$components) {
        if(this.$components[i].namespace == namespace) {
            isExist = i;
        }
    }

    if(isExist) {
        // Overwritting
        this.$root.$components[isExist] = newComponent;
    } else this.$root.$components.push(newComponent); // New Component
};

/**
 * $requires
 * @param namespace
 * @returns {*}
 */
Blocnode.prototype.$requires = function(namespace) {
    /**
     * Spliting the namespace
     */
    let parts = namespace.split('.');
    let ns    = this.$root;

    /**
     * Recover the component
     */
    for(let i in parts) {
        ns = ns[parts[i]];
    }

    return ns;
};

/**
 * $inject
 * @param namespace
 * @param isInstance
 * @param requires[]
 */
Blocnode.prototype.$inject = function(namespace, type, requires) {
    /**
     * Get the component in the requires array (always on last index)
     */
    let component = requires[requires.length - 1];
    requires.pop(); // no need the component in the requires array anymore;

    /**
     * Prepare the components requirements
     */
    let requiredParams = [];
    for(let i in requires) {
        requiredParams.push(this.$requires(requires[i]));
    }

    /**
     * Browser on to the namespace and injecting the component.
     * Creating new space in the namespace if needed.
     */
    let parts = namespace.split('.');
    let ns    = this;

    for(let i in parts) {
        if(i < parts.length - 1) {
            ns[parts[i]] = ns[parts[i]] || {};
            ns = ns[parts[i]];
        } else {
            switch(type) {
                case "instance":
                    ns[parts[i]] = new component(...requiredParams);
                    break;
                case "function":
                    ns[parts[i]] = function() {
                        return component(...requiredParams, ...arguments);
                    };
                    break;
                case "class":
                    ns[parts[i]] = function() {
                        return new component(...requiredParams, ...arguments);
                    };
                    break;
                case "object":
                    ns[parts[i]] = component;
                    break;
            }
        }
    }
};

/**
 * $function
 * @param namespace
 * @param requires
 */
Blocnode.prototype.$function = function(namespace, requires) {
    this.$_addComponent('function', namespace, requires)
};

/**
 * $instance
 * @param namespace
 * @param requires
 */
Blocnode.prototype.$instance = function(namespace, requires) {
    this.$_addComponent('instance', namespace, requires);
};

/**
 * $class
 * @param namespace
 * @param requires
 */
Blocnode.prototype.$class = function(namespace, requires) {
    this.$_addComponent('class', namespace, requires);
};

/**
 * $object
 * @param namespace
 */
Blocnode.prototype.$object = function(namespace, requires) {
    this.$_addComponent('object', namespace, requires);
};

module.exports = Blocnode;
