const assert   = require('assert');
const Blocnode = require('../index');
const App      = Blocnode('Blocnode');

describe('Blocnode Library', function() {
    it('Should have Blocnode as component name', function() {
        assert.equal('Blocnode', App.$name);
    });

    it('Should add an instance component', function() {
        App.$_addComponent('instance', 'MyComponent', [
            function MyComponent() {
                this.say = 'myname';
            }
        ]);

        assert.equal('Function', App.$components[0].requires[0].constructor.name);
    });

    it('Should create a new Bloc Module', function() {
        let newModule = App.$module('MyModule');
        assert.equal(newModule.$name, App.MyModule.$name);
    });

    it('Should create instance of MyComponent', function() {
        App.$inject('Blocnode.MyComponent', 'instance', App.$components[0].requires);
        assert.equal('myname', App.Blocnode.MyComponent.say);
    });

    it('Should return MyComponent', function() {
        assert.equal('myname', App.$requires('Blocnode.MyComponent').say);
    });

    it('Should add Instance Component', function() {
        App.$instance('MyInstanceComponent', [
            function() {
                this.name = 'MyInstanceComponent';
            }
        ]);
        assert.equal('Function', App.$components[1].requires[0].constructor.name);
    });

    it('Should add Function Component', function() {
        App.$function('MyFunctionComponent', [
            function() { return true }
        ]);
        assert.equal('Function', App.$components[2].requires[0].constructor.name);
    });

    it('Should add Class Component', function() {
        App.$class('MyClassComponent', [
            function MyClassComponent() {
                this.name = 'MyClassComponent';
            }
        ]);
        assert.equal('Function', App.$components[3].requires[0].constructor.name);
    });

    it('Should add Object Component', function() {
        let myArray = [];
        myArray['name'] = 'MyObjectComponent';
        App.$object('MyObjectComponent', [
            myArray
        ]);
        assert.equal('Array', App.$components[4].requires[0].constructor.name);
    });

    it('Should add Instance Component with MyInstanceComponent as require', function() {
        App.$instance('MyRequireTest', [
            'Blocnode.MyInstanceComponent',
            function MyRequireTest(MyInstanceComponent) {
                this.test = MyInstanceComponent;
            }
        ]);

        assert.equal('Blocnode.MyInstanceComponent', App.$components[5].requires[0]);
    });

    it('Should add priority point to MyObjectComponent', function() {
        App.$addPriorityPoint('Blocnode.MyObjectComponent');
        assert.equal(1, App.$components[4].priority);
    });

    it('Should add priority to a components and all it\'s requirements', function() {
        App.$browseComponentRequirements('Blocnode.MyRequireTest');
        assert.equal(1, App.$components[1].priority);
    });

    it('Should set Priority point to all components', function() {
        App.$setPriorityComponents();
        assert.equal(App.$components[0].namespace, 'Blocnode.MyInstanceComponent');
    });

    it('Should drop MyComponent', function() {
        App.$dropComponent('Blocnode.MyComponent');
        assert.equal(App.$requires('Blocnode.MyComponent'), undefined)
    });

    it('Should bootstrap all components', function() {
        App.$bootstrap();
        assert.equal(App.Blocnode.MyRequireTest.test.name, 'MyInstanceComponent')
    });
});