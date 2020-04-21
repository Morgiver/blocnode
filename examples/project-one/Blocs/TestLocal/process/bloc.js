
const Blocnode = require('../../../../../src/Blocnode.js');

class TestLocalBloc extends Blocnode {
    constructor(RootBloc) {
        super(RootBloc);

        this.log('Instantiate Test Local Bloc')
    }

    async main() {
        this.log('Executing Main Function in Test Local Bloc');
    }

    async onReady() {
        this.log('Executing onReady Function in Test Local Bloc');
    }
}

module.exports = TestLocalBloc;