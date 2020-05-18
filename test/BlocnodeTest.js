const assert   = require('assert');
const Blocnode = require('../src/Blocnode.js');

describe('Blocnode', function() {
    describe('Root Bloc Application', function() {
        it('Should be the Root Application Bloc', function() {
            let bloc = new Blocnode();
            assert.equal(bloc.isRoot, true);
        });

        it(`Should add a new Bloc in namespace`, function() {
            let bloc = new Blocnode();

            class TestBloc extends Blocnode {
                constructor(RootBloc) {
                    super(RootBloc);
                }
            }

            bloc.addBloc({
                name: 'two',
                Class: TestBloc
            }, { nodeModulePath: './node_modules', blocPath: './src/Blocs', excludes: [], includes: [] });

            let two = bloc.require('two');

            assert.equal(two.isRoot, false);
        });

        it(`Shouldn't add a new Bloc in namespace`, function() {
            let bloc = new Blocnode(null, ['two']);

            class TestBloc extends Blocnode {
                constructor(RootBloc) {
                    super(RootBloc);
                }
            }

            bloc.addBloc({
                name: 'two',
                Class: TestBloc
            }, { nodeModulePath: './node_modules', blocPath: './src/Blocs', excludes: [], includes: [] });

            try {
                let two = bloc.require('two');
            } catch(e) {
                assert.equal(e.message, 'Namespace two is undefined');
            }
        });

        it(`Shouldn't add a non Blocnode Class Bloc`, function() {
            let bloc = new Blocnode(null, ['two']);

            class TestBloc {
                constructor() {
                }
            }

            try {
                bloc.addBloc({
                    name: 'two',
                    Class: TestBloc
                }, { nodeModulePath: './node_modules', blocPath: './src/Blocs', excludes: [], includes: [] });
            } catch(e) {
                assert.equal(e.message, `This [ two ] is not a Blocnode class (or extension)`);
            }
        });
    });
});