
const path = require('path');
const fs   = require('fs');

class Blocnode {
    constructor(Rootbloc = null, blocs = []) {
        this.name    = null;
        this.isRoot  = true;
        this.isReady = true;

        let namespace = {};
        let state     = {};

        let dependencies = [];

        /**
         * getExcludedBlocs
         * @returns {[]}
         */
        this.getExcludedBlocs = () => {
            if(this.isRoot) return blocs;
            else return Rootbloc.getExcludedBlocs();
        };

        /**
         * getState
         * @description Access to the state.
         * @returns Object
         */
        this.getState = () => {
            if(this.isRoot) return state;
            else return Rootbloc.getState();
        };

        /**
         * addBloc
         * @description adding a bloc to the namespace
         * @param Bloc
         */
        this.addBloc = (Bloc, opt) => {
            if(this.isRoot) {
                if((!opt.mode && !opt.excludes.find(item => item === Bloc.name)) || (opt.mode && opt.mode === 'include' && opt.includes.find(item => item === Bloc.name))) {
                    if(Bloc.Class && (Bloc.Class instanceof Blocnode || Bloc.Class.prototype instanceof Blocnode)) {
                        if(!namespace[Bloc.name]) {
                            namespace[Bloc.name] = new Bloc.Class(this);
                            namespace[Bloc.name].name = Bloc.name;
                        }
                    } else throw new Error(`This [ ${Bloc.name} ] is not a Blocnode class (or extension)`);
                }
            } else Rootbloc.addBloc(Bloc, opt);
        }

        /**
         * require
         * @param pathname
         * @returns {*}
         */
        this.require = (pathname) => {
            if(this.isRoot) {
                let parts = pathname.split('.');
                let root  = namespace;

                for(let i in parts) {
                    if(root[parts[i]] !== undefined) {
                        root = root[parts[i]];
                    } else throw new Error(`Namespace ${parts[i]} is undefined`);
                }
                return root;
            } else return Rootbloc.require(pathname);
        };

        /**
         * log
         * @description Will console.log message according to the state of app
         * @param message
         */
        this.log = (message) => {
            if(this.isRoot) {
                if(state.verbose) console.log(`[${new Date()}] ${message}`);
            } else Rootbloc.log(message);
        };

        /**
         * blocReady
         * @param name
         * @returns {Promise<void>}
         */
        this.blocReady = async (name) => {
            if(this.isRoot) {
                for(let i in namespace) {
                    if (i === name && !namespace[i].isReady) {
                        namespace[i].isReady = true;
                    }
                }

                for(let i in namespace) {
                    if(i !== name && !namespace[i].isReady) {
                        await namespace[i].blocReady(name);
                    }
                }
            } else {
                for(let i in dependencies) {
                    if(dependencies[i] === name) {
                        dependencies.splice(i, 1);
                    }
                }

                if(dependencies.length < 1) {
                    await this.main();
                    await this.onReady();
                    await Rootbloc.blocReady(this.name);
                }
            }
        };

        if(!Rootbloc) {
            /**
             * We are in the RootBloc, here we can set some method to manage all
             * the blocs.
             * But first, we need to define the root application state
             */
            let args = [];

            process.argv.forEach(item => args.push(item));

            state.nodepath = args[0];
            args.shift();
            state.rootpath = args[0];
            args.shift();

            for(let i in args) {
                // Checking for command params with "--"
                let parts = args[i].split('--');
                // If it's not a params with "--", testing with "-"
                if(parts.length < 2) parts = args[i].split('-');
                // removing the first parts, a simple empty string
                parts.shift();

                if(parts.length > 0) {
                    // Adding argument to the root application state
                    let pair = parts[0].split('=');
                    state[pair[0]] = pair[1] || true;
                }
            }

            /**
             * If param exclude is set, take the string and split it with ","
             * to get an array of Bloc to exclude
             */
            if(state.exclude) {
                let excluded = state.exclude.split(',');
                state.exclude = excluded;

                excluded.forEach(item => blocs.push(item.toString()));

                this.log(`Some Bloc are excluded : ${blocs}`);
            }

            /**
             * getNamespace
             * @returns Object
             */
            this.getNamespace = () => {
                return namespace;
            }

            /**
             * loadNpmBlocs
             * @returns {Promise<void>}
             */
            this.loadNpmBlocs = async (rootPath, opt) => {
                let nodeDir = path.join(rootPath, opt.nodeModulePath);
                let dependencies = fs.readdirSync(nodeDir);

                for(let i in dependencies) {
                    if(dependencies[i] !== '.' && dependencies[i] !== '..') {
                        let parts = dependencies[i].split('-');
                        if(parts[0] === "bn") {
                            this.addBloc(require(path.join(nodeDir, `./${dependencies[i]}`)), opt);
                        }
                    }
                }
            }

            /**
             * loadBlocs
             * @param rootDir
             * @returns {Promise<void>}
             */
            this.loadBlocs = async (blocsDir, opt) => {
                let dirBlocPath = path.join(blocsDir, opt.blocPath);
                let dir = fs.readdirSync(dirBlocPath);

                for(let i in dir) {
                    if(i !== "." && i !== "..") {
                        let blocpath = path.join(dirBlocPath, dir[i]);

                        if(fs.existsSync(blocpath) &&
                            fs.lstatSync(blocpath).isDirectory()) {
                            this.addBloc(require(blocpath), opt);
                        }
                    }
                }
            }

            /**
             * loadSourceBlocs
             * @param rootDir
             * @returns {Promise<void>}
             */
            this.loadSourceBlocs = async (rootDir, opt) => {
                await this.loadBlocs(rootDir, opt);
            }

            /**
             * loadAllBlocs
             * @returns {Promise<void>}
             */
            this.loadAllBlocs = async (rootDir, opt) => {
                await this.loadNpmBlocs(rootDir, opt);
                await this.loadSourceBlocs(rootDir, opt);
            }
        } else {
            /**
             * We're not in the RootBloc
             */
            this.isRoot  = false;
            this.isReady = false;

            this.addDependency = (name) => {
                if(this.getExcludedBlocs().find(item => item === name) === undefined) {
                    dependencies.push(name);
                }
            }
        }
    }

    /**
     * initialize
     * @param rootDir
     * @param localBlocs
     */
    async initialize(rootDir, opt) {
        if(this.isRoot) {
            this.log("Initializing Application");

            await this.loadAllBlocs(rootDir, opt);
            await this.blocReady("START_APPLICATION");
        }
    }

    /**
     * onReady
     * @returns {Promise<void>}
     */
    async onReady() {
        this.log(`Bloc ${this.name} is ready !`);
    }

    /**
     * main
     * @param rootDir
     * @param configuration
     * @returns {Promise<void>}
     */
    async main(rootDir, configuration = { nodeModulePath: './node_modules', blocPath: './src/Blocs', excludes: [], includes: [] }) {
        if(this.isRoot) {
            await this.initialize(rootDir, configuration);
        }
    }
}

module.exports = Blocnode;