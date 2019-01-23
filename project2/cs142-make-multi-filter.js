"use strict";

/* ---------------------- cs142MakeMultiFilter ---------------------- */
/*  Returns an arrayFilterer that can be used to repeatedly filter    */
/*  elements out of the originalArray.                                */
function cs142MakeMultiFilter(originalArray) {
    let currentArray = originalArray.slice();
    return function arrayFilterer(filterCriteria, callback) {
        if (typeof(filterCriteria) !== "function") {
            return currentArray;
        }
        for (let i = currentArray.length - 1; i >= 0; i--) {
            if (!filterCriteria(currentArray[i])) {
                currentArray.splice(i, 1)
            }
        }
        if (typeof(callback) === "function") {
            callback.call(originalArray, currentArray)
        }
        return arrayFilterer;
    }
}