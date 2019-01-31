"use strict";

/* ----------------------------- TableTemplate ----------------------------- */
/*  @param id = id tag for an HTML table                                     */
/*  @param dict = dictionary with properties to be replaced                  */
/*  @param columnName = specifies a column whose cells' values will be       */
/*     replaced by fillIn method. If empty, fillIn replaces all cells'       */
/*     values.                                                               */
class TableTemplate { 
    static fillIn(id, dict, columnName) {
        // Replaces text of the form {{property}} with corresponding value from dict.
        let table = document.getElementById(id);
        if (columnName) {
            // Always replaces the header row's {{property}} text.
            let header = table.rows[0];
            let headerTemplate = new Cs142TemplateProcessor(header.innerHTML);
            header.innerHTML = headerTemplate.fillIn(dict);

            // Finds if a column with the name given by columnName exists; returns immediately if nonexistant.
            let columnIndex = -1;
            for (let i = 0; i < header.cells.length; i++) {
                if (header.cells[i].textContent == columnName) {
                    columnIndex = i;
                    break;
                }
            }
            if (columnIndex == -1) return;

            // Replaces text of form {{property}} in column specified by columnName with its corresponding value from dict.
            let rows = table.rows;
            for (let i = 1; i < rows.length; i++) {
                let cell = rows[i].cells[columnIndex]; 
                let cellTemplate = new Cs142TemplateProcessor(cell.innerHTML);
                cell.innerHTML = cellTemplate.fillIn(dict);
            }
        } else {
            // If no columnName was specified, replaces all text of form {{property}} in the table with its corresponding value from dict.
            for (let i = 0; i < table.rows.length; i++) {
                let row = table.rows[i];
                let rowTemplate = new Cs142TemplateProcessor(row.innerHTML);
                row.innerHTML = rowTemplate.fillIn(dict);
            }
        }
        table.style.visibility = "visible";
    }
}
