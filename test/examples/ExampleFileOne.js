module.exports = (function(Library) {
    class MyClassOne {
        static say() { return "MyClassOne"; }
    }
    Library.namespace('Example.One').MyClassOne = MyClassOne;
});