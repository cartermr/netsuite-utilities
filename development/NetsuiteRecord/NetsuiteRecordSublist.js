/**
 * @NApiVersion 2.1
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    class NetsuiteRecordSublist extends Array {
        #fieldList = [];
        nsAPI;
        sublistId = '';
        linecount = 0;
        constructor(sublistId, nsRecord) {
            super();
            this.nsAPI = nsRecord;
            this.sublistId = sublistId;
            this.linecount = this.nsAPI.getLineCount({ sublistId: this.sublistId });
            this.#fieldList = this.nsAPI.getSublistFields({ sublistId: this.sublistId });
            this.#buildSublistLines();
        }
        #buildSublistLines() {
            if (this.linecount > 0 && this.#fieldList.length > 0) {
                for (let lineNumber = 0; lineNumber < this.linecount; lineNumber++) {
                    let newLine = {};
                    for (const fieldId of this.#fieldList) {
                        Object.defineProperties(newLine, {
                            [fieldId]: {
                                get: () => this.nsAPI.getSublistValue({ sublistId: this.sublistId, fieldId: fieldId, line: lineNumber }),
                                set: (value) => this.nsAPI.setSublistValue({ sublistId: this.sublistId, fieldId: fieldId, line: lineNumber, value: value }),
                                enumerable: true
                            },
                            [`${fieldId}TEXT`]: {
                                get: () => this.nsAPI.getSublistText({ sublistId: this.sublistId, fieldId: fieldId, line: lineNumber }),
                                set: (value) => this.nsAPI.setSublistText({ sublistId: this.sublistId, fieldId: fieldId, line: lineNumber, text: value }),
                                enumerable: true
                            }
                        });
                    }
                }
            }
        }
    }
    return NetsuiteRecordSublist;
});
