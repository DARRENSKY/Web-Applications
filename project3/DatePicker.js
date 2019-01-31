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
            <button onclick='" + this + ".render(" + nextDate + ")'>&#8249;</button>" + 
            month(date) + " " + date.getFullYear() + 
            "<button>&#8250;</button>\
        </div>\
        <div class='days-of-week'>" + 
            daysOfWeek() + 
        "</div>";

    // Makes header of datepicker
    // datepicker.innerHTML = "\
    //     <div class='datepicker-header'>\
    //         <button>&#8249;</button>" + 
    //         month(date) + " " + date.getFullYear() + 
    //         "<button>&#8250;</button>\
    //     </div>\
    //     <div class='days-of-week'>" + 
    //         daysOfWeek() + 
    //     "</div>";

    datepicker.innerHTML += "<div class='week'>" + populateInitialWeek(date) + "</div>";
    let currDay = 8 - date.getDay();
    let numDaysInCurrMonth = getDaysInMonth(date.getMonth());
    while (currDay <= numDaysInCurrMonth) {
        datepicker.innerHTML += "<div class='week'>" + populateWeek(currDay, numDaysInCurrMonth) + "</div>";
        currDay += 7;
    }
};

/* Populates the first row of the datepicker with date numbers. */
function populateInitialWeek(date) {
    let week = "";
    let currDay = 1;
    let numDaysInPrevMonth = getDaysInMonth(date.getMonth() - 1);
    let prevMonthDay = getDaysInMonth(date.getMonth() - 1) - date.getDay() + 1;
    for (let i = 0; i < 7; i++) {
        if (prevMonthDay <= numDaysInPrevMonth) {
            week += "<div class='other-day'>" + prevMonthDay + "</div>";
            prevMonthDay++;
        } else {
            week += "<div class='day'>" + currDay + "</div>";
            currDay++;
        }
    }
    return week;
}

/* Populates a row of the datepicker with date numbers. */
function populateWeek(currDay, numDaysInCurrMonth) {
    let week = "";
    for (let i = 0; i < 7; i++) {
        if (currDay > numDaysInCurrMonth) {
            week += "<div class='other-day'>" + (currDay - numDaysInCurrMonth) + "</div>";
        } else {
            week += "<div class='day'>" + currDay + "</div>";
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
function getDaysInMonth(month) {
    if (month < 0) month = 11;
    if (month === 1) return date.getFullYear() % 4 === 0 ? 29 : 28;
    switch (month) {
        case 0: 
        case 2:
        case 4:
        case 6:
        case 7:
        case 9:
        case 11:
            return 31;
        default: 
            return 30;
    }
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