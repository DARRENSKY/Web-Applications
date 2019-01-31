"use strict";

class TableTemplate { 
    static fillIn(id, dict, columnName) {
        let table = document.getElementById(id);
        let header = table.rows[0];
        let tableTemplate = new Cs142TemplateProcessor(header.innerHTML);
        header.innerHTML = tableTemplate.fillIn(dict);
    }
}
