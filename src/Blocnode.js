
/**
 * Blocnode
 * @description Blocnode is a very simple class that help create a namespace
 *              to build a library or an entire app.
 */
class Blocnode {
    /**
     * constructor
     * @description Blocnode node constructor get an Array "modulePaths" of
     *              modules names
     * @param modulePaths
     */
    constructor(modulePaths = []) {
        for(let i in modulePaths) {
            (require(modulePaths[i]))(this);
        }
    }

    /**
     * namespace
     * @description namespace method get a String "namespace"
     * @param namespace
     * @returns {Blocnode}
     */
    namespace(namespace) {
        let parts = namespace.split('.');
        let root  = this;

        for(let i in parts) {
            root[parts[i]] = root[parts[i]] || {};
            root = root[parts[i]];
        }

        return root;
    }
}

module.exports = Blocnode;