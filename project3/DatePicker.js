"use strict";

/* ------------------------------ DatePicker ----------------------------- */
/*  @param id: [string] id of div that will be populated by the            */
/*    DatePicker                                                           */
/*  @param dateSelection: Function that will be called when clicking       */
/*    on a cell of the DatePicker.                                         */ 
function DatePicker(id, dateSelection) {
    this.id = id;
    this.dateSelection = dateSelection;
    this.date = null;
}

/* --------------------- DatePicker.prototype.render --------------------- */
/*  @param date: [Date] Corresponds to the month and year that will be     */
/*    displayed by the DatePicker.                                         */
DatePicker.prototype.render = function(date) {

/* ----------------------- Private Helper Functions ---------------------- */

    /* --------------------------- getPrevDate --------------------------- */
    /*  @param date: [Date] The current date displayed by the DatePicker.  */
    /*  @use: Returns a date object corresponding to the previous month.   */
    var getPrevDate = function(date) {
        return new Date(date.getMonth() === 0 ? date.getFullYear() - 1 : date.getFullYear(), date.getMonth() === 0 ? 11 : date.getMonth() - 1);
    };

    /* --------------------------- getNextDate --------------------------- */
    /*  @param date: [Date] The current date displayed by the DatePicker.  */
    /*  @use: Returns a date object corresponding to the next month.       */
    var getNextDate = function(date) {
        return new Date(date.getMonth() === 11 ? date.getFullYear() + 1 : date.getFullYear(), date.getMonth() === 11 ? 0 : date.getMonth() + 1);
    };

    /* -------------------------- getDaysInMonth ------------------------- */
    /*  @param year: [int] Year of month we're checking.                   */
    /*  @param month: [int] Month that we're checking.                     */
    /*  @use: Returns the number of days in the month given by params.     */
    var getDaysInMonth = function(year, month) {
        if (month < 0) {
            month = 11;
            year -= 1;
        }
        return new Date(year, month + 1, 0).getDate();
    };

    /* --------------------- addButtonEventListeners --------------------- */
    /*  @param _this: Points to the DatePicker object.                     */
    /*  @use: Adds EventListeners to the back and forward buttons on the   */
    /*    DatePicker.                                                      */
    var addButtonEventListeners = function(_this) {
        document.getElementById(_this.id + "-back-button").addEventListener("click", function () {
            _this.render(getPrevDate(_this.date));
        });
        document.getElementById(_this.id + "-forward-button").addEventListener("click", function () {
            _this.render(getNextDate(_this.date));
        });
    };

    /* ---------------------- addCellEventListeners ---------------------- */
    /*  @param _this: points to the DatePicker object.                     */
    /*  @use: Adds EventListeners to all the cells of the DatePicker,      */ 
    /*    creating an onclick event that calls dateSelection.              */
    var addCellEventListeners = function(_this) {
        let numDaysInCurrMonth = getDaysInMonth(_this.date.getFullYear(), _this.date.getMonth());
        for (let i = 1; i <= numDaysInCurrMonth; i++) {
            document.getElementById(_this.id + "-day" + i).addEventListener("click", function () {
                _this.dateSelection(_this.id, {day: i, month: _this.date.getMonth() + 1, year: _this.date.getFullYear()});
            });
        }
    };

    /* ----------------------- populateInitialWeek ----------------------- */
    /*  @param id: [string] ID of the div populated by the DatePicker.     */
    /*  @use: Populates the first row of the DatePicker with dates.        */
    var populateInitialWeek = function(id, date) {
        let week = "";
        let currDay = 1;
        let numDaysInPrevMonth = getDaysInMonth(date.getFullYear(), date.getMonth() - 1);
        let prevMonthDay = getDaysInMonth(date.getFullYear(), date.getMonth() - 1) - date.getDay() + 1;
        for (let i = 0; i < 7; i++) {
            if (prevMonthDay <= numDaysInPrevMonth) {
                week += "<div class='other-day'>" + prevMonthDay + "</div>";
                prevMonthDay++;
            } else {
                week += "<div class='day'><a id='" + id + "-day" + currDay + "'>" + currDay + "</a></div>";
                // week += "<div class='day'><button id='" + id + "-day" + currDay + "'>" + currDay + "</button></div>";
                currDay++;
            }
        }
        return week;
    };

    /* --------------------------- populateWeek -------------------------- */
    /*  @param _this: Points to the DatePicker object.                     */
    /*  @use: Populates a row of the DatePicker with dates.                */
    var populateWeek = function(_this, currDay, numDaysInCurrMonth) {
        let week = "";
        for (let i = 0; i < 7; i++) {
            if (currDay > numDaysInCurrMonth) {
                week += "<div class='other-day'>" + (currDay - numDaysInCurrMonth) + "</div>";
            } else {
                week += "<div class='day'><a id='" + _this.id + "-day" + currDay + "'>" + currDay + "</a></div>";
            }
            currDay++;
        }
        return week;
    };
    
    /* ------------------------------ dayOfWeek -------------------------- */
    /*  @param day: [int] corresponding to day we're converting.           */ 
    /*  @use: Returns the string representation of the param.              */
    var dayOfWeek = function(day) {
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
    };

    /* ---------------------------- daysOfWeek --------------------------- */
    /* @use: Returns a string of HTML text to populate the header of       */
    /*   the DatePicker with names of days.                                */
    var daysOfWeek = function() {
        let daysOfWeek = "";
        for (let i = 0; i < 7; i++) {
            daysOfWeek += "<div class='day-header'>" + dayOfWeek(i) + "</div>";
        } 
        return daysOfWeek;
    };

    /* ------------------------------- month ----------------------------- */
    /*  @param date: [Date] with month we're converting to a str.          */
    /*  @use: Returns the string representation of the param's month.      */
    var month = function(date) {
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
    };

/* -------------------- DatePicker.prototype.render ---------------------- */

    if (typeof date.getMonth !== "function") {
        return; 
    }

    date.setDate(1);
    this.date = date;
    let datepicker = document.getElementById(this.id);

    // Makes header of DatePicker.
    datepicker.innerHTML =  "<div class='datepicker-header'>" + 
                                "<a id='" + this.id + "-back-button'>&#8249;</a>" + 
                                "<div class='title'>" + 
                                    month(date) + " " + date.getFullYear() + 
                                "</div>" + 
                                "<a id='" + this.id + "-forward-button'>&#8250;</a>" + 
                            "</div>" + 
                            "<div class='days-of-week'>" + 
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