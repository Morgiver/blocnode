
const Blocnode = require('../../../../../../src/Blocnode.js');

class TestSourceBloc extends Blocnode {
    constructor(RootBloc) {
        super(RootBloc);

        this.log('Instantiate Test Source Bloc');
    }

    async main() {
        this.log('Executing Main Function in Test Source Bloc');
    }

    async onReady() {
        this.log('Executing onReady Function in Test Source Bloc');
    }
}

module.exports = TestSourceBloc;