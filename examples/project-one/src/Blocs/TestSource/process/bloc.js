
const Blocnode = require('../../../../../../src/Blocnode.js');

class TestSourceBloc extends Blocnode {
    constructor(RootBloc) {
        super(RootBloc);

        this.log('Instantiate Test Source Bloc');
        this.addDependency('TestLocal');
    }

    async main() {
        this.log('Executing Main Function in Test Source Bloc');
    }

    async onReady() {
        this.log('Executing onReady Function in Test Source Bloc');
        super.onReady();
    }
}

module.exports = TestSourceBloc;