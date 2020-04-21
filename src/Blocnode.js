
class Blocnode {
    constructor(Rootbloc = null, blocs = []) {
        this.isRoot = true;

        let namespace = {};
        let state     = {};

        /**
         * addBloc
         * @description adding a bloc to the namespace
         * @param Bloc
         */
        this.addBloc = (Bloc) => {
            if(this.isRoot) {
                if(blocs.find(item => item === Bloc.name)) {
                    if(Bloc.Class && Bloc.Class instanceof Blocnode) {
                        let newBloc = new Bloc.Class(this);

                        if(!namespace[newBloc.name]) {
                            namespace[newBloc.name] = newBloc;
                        }
                    }
                }
            } else Rootbloc.addBloc(Bloc);
        }

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
        } else {
            /**
             * We're not in the RootBloc, defining it as it is.
             */
            this.isRoot = false;
        }

        /**
         * getState
         * @description Access to the state.
         * @returns Object
         */
        this.getState = () => {
            if(this.isRoot) return state;
            else return Rootbloc.getState();
        };
    }
}

module.exports = Blocnode;