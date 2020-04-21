
class Blocnode {
    constructor(Rootbloc = null, blocs = []) {
        this.isRoot = true;

        let namespace = {};
        let state     = {};

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
        this.addBloc = (Bloc) => {
            if(this.isRoot) {
                if(!blocs.find(item => item === Bloc.name)) {
                    if(Bloc.Class && (Bloc.Class instanceof Blocnode || Bloc.Class.prototype instanceof Blocnode)) {
                        if(!namespace[Bloc.name]) {
                            namespace[Bloc.name] = new Bloc.Class(this);
                        }
                    } else throw new Error(`This [ ${Bloc.name} ] is not a Blocnode class (or extension)`);
                }
            } else Rootbloc.addBloc(Bloc);
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
                if(state.dev) console.log(`[${new Date()}] ${message}`);
            } else Rootbloc.log(message);
        }

        if(!Rootbloc) {
            this.localblocspath  = './Blocs';
            this.sourceblocspath = './src/Blocs';

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
            this.loadNpmBlocs = async (rootPath) => {
                let dependencies = require(path.join(rootPath, './package.json')).dependencies;

                for(let i in dependencies) {
                    let parts = i.split('-');
                    if(parts[0] === "bn") {
                        this.addBloc(require(i));
                    }
                }
            }

            /**
             * loadBlocs
             * @param rootDir
             * @returns {Promise<void>}
             */
            this.loadBlocs = async (blocsDir, blocpath) => {
                let blocPath = path.join(blocsDir, blocpath);
                let dir = fs.readdirSync(blocPath);

                for(let i in dir) {
                    if(i !== "." && i !== "..") {
                        if(fs.existsSync(`${blocPath}/${dir[i]}`) &&
                            fs.lstatSync(`${blocPath}/${dir[i]}`).isDirectory()) {
                            let bloc = require(`${blocPath}/${dir[i]}`);
                            this.addBloc(bloc);
                        }
                    }
                }
            }

            /**
             * loadLocalBlocs
             * @param blocsDir
             * @returns {Promise<void>}
             */
            this.loadLocalBlocs = async (blocsDir) => {
                await this.loadBlocs(blocsDir, this.localblocspath);
            }

            /**
             * loadSourceBlocs
             * @param rootDir
             * @returns {Promise<void>}
             */
            this.loadSourceBlocs = async (rootDir) => {
                await this.loadBlocs(rootDir, this.sourceblocspath);
            }

            /**
             * loadAllBlocs
             * @returns {Promise<void>}
             */
            this.loadAllBlocs = async (rootDir, blocsDir) => {
                await this.loadNpmBlocs(rootDir);
                await this.loadSourceBlocs(rootDir);
                await this.loadLocalBlocs(blocsDir);
            }

            /**
             * initBlocs
             * @returns {Promise<void>}
             */
            this.initBlocs = async () => {
                for(let i in namespace) {
                    await namespace[i].main();
                }
            }
        } else {
            /**
             * We're not in the RootBloc, defining it as it is.
             */
            this.isRoot = false;
        }
    }

    /**
     * initialize
     * @param rootDir
     * @param localBlocs
     */
    async initialize(rootDir, localBlocs) {
        if(this.isRoot) {
            this.log("Initializing Application");

            await this.loadAllBlocs(rootDir, localBlocs)
            await this.initBlocs();
        }
    }

    /**
     * onReady
     * @returns {Promise<void>}
     */
    async onReady() {
        if(this.isRoot) {
            let ns = this.getNamespace();

            for(let i in ns) {
                await ns[i].onReady();
            }
        }
    }

    /**
     * main
     * @param rootDir
     * @param localBlocs
     * @returns {Promise<void>}
     */
    async main(rootDir, localBlocs) {
        if(this.isRoot) {
            await this.initialize(rootDir, localBlocs);
            await this.onReady();
        }
    }
}

module.exports = Blocnode;