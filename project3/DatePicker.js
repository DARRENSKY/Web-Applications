"use strict";

/* */
function DatePicker(id, dateSelection) {
    this.id = id;
    this.dateSelection = dateSelection;
}

/* */
DatePicker.prototype.render = function(date) {
    if (typeof date.getMonth !== 'function') return; 
    let datepicker = document.getElementById(this.id);
    date.setDate(1);

    // Makes header of datepicker
    datepicker.innerHTML = "\
        <div class='datepicker-header'>\
            <button class='back-button'>&#8249;</button>" + 
            month(date) + " " + date.getFullYear() + 
            "<button class='forward-button'>&#8250;</button>\
        </div>\
        <div class='days-of-week'>" + 
            daysOfWeek() + 
        "</div>";

    // let self = this;
    // document.getElementsByClassName("back-button")[0].addEventListener("click", function () {
    //     self.render(getNextDate(date));
    // });
    // document.getElementsByClassName("forward-button")[0].addEventListener("click", function () {
    //     self.render(getPreviousDate(date));
    // });
    
    // Makes body of datepicker
    datepicker.innerHTML += "<div class='week'>" + populateInitialWeek(date, this.id, this.dateSelection) + "</div>";
    let currDay = 8 - date.getDay();
    let numDaysInCurrMonth = getDaysInMonth(date.getFullYear(), date.getMonth());
    while (currDay <= numDaysInCurrMonth) {
        datepicker.innerHTML += "<div class='week'>" + populateWeek(this.id, this.dateSelection, date, currDay, numDaysInCurrMonth) + "</div>";
        currDay += 7;
    }

    addEventListeners(this.id, date);
};

function addEventListeners(id, date) {
    for (let i = 1; i <= getDaysInMonth(date.getFullYear(), date.getMonth()); i++) {
        console.log(document.getElementById(id + "-day" + i));
    }
}

/* Returns a date object with the next month. */
function getNextDate(date) {
    return new Date(date.getMonth() === 11 ? date.getFullYear() + 1 : date.getFullYear(), date.getMonth() === 11 ? 0 : date.getMonth() + 1);
}

/* Returns a date object with the previous month. */
function getPreviousDate(date) {
    return new Date(date.getMonth() === 0 ? date.getFullYear() - 1 : date.getFullYear(), date.getMonth() === 0 ? 11 : date.getMonth() - 1);
}

/* Populates the first row of the datepicker with date numbers. */
function populateInitialWeek(date, id, dateSelection) {
    let week = ""
    let currDay = 1;
    let numDaysInPrevMonth = getDaysInMonth(date.getFullYear(), date.getMonth() - 1);
    let prevMonthDay = getDaysInMonth(date.getFullYear(), date.getMonth() - 1) - date.getDay() + 1;
    for (let i = 0; i < 7; i++) {
        if (prevMonthDay <= numDaysInPrevMonth) {
            week += "<div class='other-day'>" + prevMonthDay + "</div>";
            prevMonthDay++;
        } else {
            // week += "<div class='day'>" + currDay + "</div>";
            week += "<div class='day'><a id='" + id + "-day" + currDay + "'>" + currDay + "</a></div>";
            currDay++;
        }
    }
    return week;
}

/* Populates a row of the datepicker with date numbers. */
function populateWeek(id, dateSelection, date, currDay, numDaysInCurrMonth) {
    let week = "";
    for (let i = 0; i < 7; i++) {
        if (currDay > numDaysInCurrMonth) {
            week += "<div class='other-day'>" + (currDay - numDaysInCurrMonth) + "</div>";
        } else {
            week += "<div class='day'><a id='" + id + "-day" + currDay + "'>" + currDay + "</a></div>";
        }
        currDay++;
    }
    return week;
}

/* Returns a string of HTML text to populate the header of the datepicker with names of days. */
function daysOfWeek() {
    let daysOfWeek = "";
    for (let i = 0; i < 7; i++) {
        daysOfWeek += "<div class='day-header'>" + dayOfWeek(i) + "</div>";
    } 
    return daysOfWeek;
}

/* Returns the number of days in the month given by DATE. */
function getDaysInMonth(year, month) {
    if (month < 0) {
        month = 11;
        year -= 1;
    }
    return new Date(year, month + 1, 0).getDate();
}

/* Returns the string representation of the month given by DATE. */
function month(date) {
    switch (date.getMonth()) {
        case 0: 
            return "January";
        case 1:
            return "February";
        case 2:
            return "March";
        case 3:
            return "April";
        case 4:
            return "May";
        case 5:
            return "June";
        case 6:
            return "July";
        case 7:
            return "August";
        case 8:
            return "September";
        case 9:
            return "October";
        case 10:
            return "November";
        case 11:
            return "December";
    }
}

/* Returns the string representation of the day given by DAY */
function dayOfWeek(day) {
    switch (day) {
        case 0:
            return "Su";
        case 1:
            return "Mo";
        case 2:
            return "Tu";
        case 3:
            return "We";
        case 4: 
            return "Th";
        case 5:
            return "Fr";
        case 6:
            return "Sa";
    }
}