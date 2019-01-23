"use strict";

function cs142MakeMultiFilter(originalArray) {
    var currentArray = originalArray.slice();
    function arrayFilterer(filterCriteria, callback) {
        if (typeof(filterCriteria) !== "function") {
            return currentArray;
        }
        for (var i = currentArray.length - 1; i >= 0; i--) {
            if (!filterCriteria(currentArray[i])) {
                currentArray.splice(i, 1)
            }
        }
        if (typeof(callback) === "function") {
            callback.call(originalArray, currentArray)
        }
        return arrayFilterer;
    }
    return arrayFilterer;
}
