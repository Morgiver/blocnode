const assert   = require('assert');
const Blocnode = require('../src/Blocnode.js');

describe('Blocnode', function() {
    describe('Root Bloc Application', function() {
        it('Should be the Root Application Bloc', function() {
            let bloc = new Blocnode();
            assert.equal(bloc.isRoot, true);
        });

        it('Should build state from process.argv', function() {
            let bloc = new Blocnode();

            assert.equal(typeof bloc.getState().nodepath, "string");
            assert.equal(typeof bloc.getState().rootpath, "string");
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
            });

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
            });

            try {
                let two = bloc.require('two');
            } catch(e) {
                assert.equal(e.message, 'Namespace two is undefined');
            }
        });
    });
});