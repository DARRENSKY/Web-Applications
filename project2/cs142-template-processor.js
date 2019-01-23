"use strict"

function Cs142TemplateProcessor(template) {
    this.template = template;
}

Cs142TemplateProcessor.prototype.fillIn = function(dictionary) {
    return template.replace(/{{[^}]*}}/g, function(match) {
        return dictionary[match.slice(2, -2)] ? dictionary[match.slice(2, -2)] : "";
    });
}