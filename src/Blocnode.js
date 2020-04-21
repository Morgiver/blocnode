
class Blocnode {
    constructor(Rootbloc = null, rootPath = null) {
        this.isRoot = true;

        let namespace = {};

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
    }
}

module.exports = Blocnode;