
let newArray = [];

newArray.push({ priority: 0 });
newArray.push({ priority: 10 });
newArray.push({ priority: 6 });
newArray.push({ priority: 23 });

newArray.sort(function(a, b) {
    return b.priority - a.priority;
});

console.log(newArray);