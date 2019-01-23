"use strict"

/* -------------------- Cs142TemplateProcessor Constructor -------------------- */
function Cs142TemplateProcessor(template) {
    this.template = template;
}

/* ------------------- Cs142TemplateProcessor fillIn Method ------------------- */
/*  When passed a dictionary, searches for matches in template of the form      */ 
/*  {{MATCH}} and replaces them based on the value of MATCH in the dictionary.  */
Cs142TemplateProcessor.prototype.fillIn = function(dictionary) {
    return this.template.replace(/{{[^}]*}}/g, function(match) { 
        return dictionary[match.slice(2, -2)] ? dictionary[match.slice(2, -2)] : "";
    });
}
