module.exports = (function(Library) {
    class MyClassTwo {
        static say() { return "MyClassTwo" }
    }
    Library.namespace('Example.Two').MyClassTwo = MyClassTwo;
});