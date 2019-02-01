"use strict";

/* ----------------------------- DatePicker ----------------------------- */
/*  @param id: [string] id of div that will be populated by the           */
/*      DatePicker                                                        */
/*  @param dateSelection: Function that will be called when clicking      */
/*    on a cell of the DatePicker.                                        */ 
function DatePicker(id, dateSelection) {
    this.id = id;
    this.dateSelection = dateSelection;
    this.date = null;
}

/* --------------------- DatePicker.prototype.render ---------------------*/
/*  @param date: [Date] Corresponds to the month and year that will be    */
/*    displayed by the DatePicker.                                        */
DatePicker.prototype.render = function(date) {
    if (typeof date.getMonth !== 'function') return; 
    date.setDate(1);
    this.date = date;
    let datepicker = document.getElementById(this.id);

    // Makes header of DatePicker.
    datepicker.innerHTML = "\
        <div class='datepicker-header'>\
            <a id='" + this.id + "-back-button'>&#8249;</a>" + 
            month(date) + " " + date.getFullYear() + 
            "<a id='" + this.id + "-forward-button'>&#8250;</a>\
        </div>\
        <div class='days-of-week'>" + 
            daysOfWeek() + 
        "</div>";

    // Makes body of DatePicker.
    datepicker.innerHTML += "<div class='week'>" + populateInitialWeek(this.id, date) + "</div>";
    let currDay = 8 - date.getDay();
    let numDaysInCurrMonth = getDaysInMonth(date.getFullYear(), date.getMonth());
    while (currDay <= numDaysInCurrMonth) {
        datepicker.innerHTML += "<div class='week'>" + populateWeek(this, currDay, numDaysInCurrMonth) + "</div>";
        currDay += 7;
    }

    // Add EventListeners
    addButtonEventListeners(this);
    addCellEventListeners(this);
};

/* --------------------- addButtonEventListeners --------------------- */
/*  @param _this: Points to the DatePicker object.                     */
/*  @use: Adds EventListeners to the back and forward buttons on the   */
/*    DatePicker.                                                      */
function addButtonEventListeners(_this) {
    document.getElementById(_this.id + "-back-button").addEventListener("click", function () {
        _this.render(getPrevDate(_this.date));
    });
    document.getElementById(_this.id + "-forward-button").addEventListener("click", function () {
        _this.render(getNextDate(_this.date));
    });
}

/* ---------------------- addCellEventListeners ---------------------- */
/*  @param _this: points to the DatePicker object.                     */
/*  @use: Adds EventListeners to all the cells of the DatePicker,      */ 
/*    creating an onclick event that calls dateSelection.              */
function addCellEventListeners(_this) {
    let prevMonthStartingDay = getDaysInMonth(_this.date.getFullYear(), _this.date.getMonth() - 1) - _this.date.getDay() + 1;
    let prevMonth = _this.date.getMonth() === 0 ? 12 : _this.date.getMonth();
    let prevYear = _this.date.getMonth() === 0 ? _this.date.getFullYear() - 1 : _this.date.getFullYear();
    let numDaysInPrevMonth = getDaysInMonth(_this.date.getFullYear(), _this.date.getMonth() - 1);
    let numDaysInCurrMonth = getDaysInMonth(_this.date.getFullYear(), _this.date.getMonth());
    let daysSoFar = (numDaysInPrevMonth - prevMonthStartingDay + 1) + numDaysInCurrMonth; 
    let nextMonth = _this.date.getMonth() === 11 ? 0 : _this.date.getMonth() + 2;
    let nextYear = _this.date.getMonth() === 11 ? _this.date.getFullYear() + 1 : _this.date.getFullYear();
    let numDaysInNextMonth = daysSoFar % 7 === 0 ? 0 : (7 - (daysSoFar % 7));

    // Set EventListeners for cells of previous month.
    for (let i = prevMonthStartingDay; i <= numDaysInPrevMonth; i++) {
        document.getElementById(_this.id + "-other-day" + i).addEventListener("click", function () {
            _this.dateSelection(_this.id, {day: i, month: prevMonth, year: prevYear});
        });
    }

    // Set EventListeners for cells of current month.
    for (let i = 1; i <= numDaysInCurrMonth; i++) {
        document.getElementById(_this.id + "-day" + i).addEventListener("click", function () {
            _this.dateSelection(_this.id, {day: i, month: _this.date.getMonth() + 1, year: _this.date.getFullYear()});
        });
    }

    // Set EventListeners for cells of next month.
    for (let i = 1; i <= numDaysInNextMonth; i++) {
        document.getElementById(_this.id + "-other-day" + i).addEventListener("click", function () {
            _this.dateSelection(_this.id, {day: i, month: nextMonth, year: nextYear});
        });
    }
}

/* -------------------------- getPrevDate -------------------------- */
/*  @param date: [Date] The current date displayed by the DatePicker.*/
/*  @use: Returns a date object corresponding to the previous month. */
function getPrevDate(date) {
    return new Date(date.getMonth() === 0 ? date.getFullYear() - 1 : date.getFullYear(), date.getMonth() === 0 ? 11 : date.getMonth() - 1);
}

/* -------------------------- getNextDate -------------------------- */
/*  @param date: [Date] The current date displayed by the DatePicker.*/
/*  @use: Returns a date object corresponding to the next month.     */
function getNextDate(date) {
    return new Date(date.getMonth() === 11 ? date.getFullYear() + 1 : date.getFullYear(), date.getMonth() === 11 ? 0 : date.getMonth() + 1);
}

/* ---------------------- populateInitialWeek ---------------------- */
/*  @param id: [string] ID of the div populated by the DatePicker.   */
/*  @use: Populates the first row of the DatePicker with dates.      */
function populateInitialWeek(id, date) {
    let week = ""
    let currDay = 1;
    let numDaysInPrevMonth = getDaysInMonth(date.getFullYear(), date.getMonth() - 1);
    let prevMonthDay = getDaysInMonth(date.getFullYear(), date.getMonth() - 1) - date.getDay() + 1;
    for (let i = 0; i < 7; i++) {
        if (prevMonthDay <= numDaysInPrevMonth) {
            week += "<div class='other-day'><a id='" + id + "-other-day" + prevMonthDay + "'>" + prevMonthDay + "</a></div>";
            prevMonthDay++;
        } else {
            week += "<div class='day'><a id='" + id + "-day" + currDay + "'>" + currDay + "</a></div>";
            currDay++;
        }
    }
    return week;
}

/* ------------------------- populateWeek ------------------------- */
/*  @param _this: Points to the DatePicker object.                  */
/*  @use: Populates a row of the DatePicker with dates.             */
function populateWeek(_this, currDay, numDaysInCurrMonth) {
    let week = "";
    for (let i = 0; i < 7; i++) {
        if (currDay > numDaysInCurrMonth) {
            week += "<div class='other-day'><a id='" + _this.id + "-other-day" + (currDay - numDaysInCurrMonth) + "'>" + (currDay - numDaysInCurrMonth) + "</a></div>";
        } else {
            week += "<div class='day'><a id='" + _this.id + "-day" + currDay + "'>" + currDay + "</a></div>";
        }
        currDay++;
    }
    return week;
}
 
/* -------------------------- daysOfWeek -------------------------- */
/* @use: Returns a string of HTML text to populate the header of    */
/*   the DatePicker with names of days. */
function daysOfWeek() {
    let daysOfWeek = "";
    for (let i = 0; i < 7; i++) {
        daysOfWeek += "<div class='day-header'>" + dayOfWeek(i) + "</div>";
    } 
    return daysOfWeek;
}

/* ------------------------ getDaysInMonth ------------------------ */
/*  @param year: [int] Year of month we're checking.                */
/*  @param month: [int] Month that we're checking.                  */
/*  @use: Returns the number of days in the month given by params.  */
function getDaysInMonth(year, month) {
    if (month < 0) {
        month = 11;
        year -= 1;
    }
    return new Date(year, month + 1, 0).getDate();
}

/* ----------------------------- month ---------------------------- */
/*  @param date: [Date] with month we're converting to a str.       */
/*  @use: Returns the string representation of the param's month.   */
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

/* -------------------------- dayOfWeek ------------------------ */
/*  @param day: [int] corresponding to day we're converting.     */ 
/*  @use: Returns the string representation of the param.        */
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