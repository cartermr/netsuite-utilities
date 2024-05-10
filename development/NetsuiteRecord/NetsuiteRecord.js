/**
 * @module NetsuiteRecord
 * @author Matt Carter
 * @description A custom module for SuiteScript 2.1 to help extend the capabilities of the native
 * Record object.
 * @NApiVersion 2.1
 */
define(["require", "exports", "./NetsuiteRecordSublist"], function (require, exports, NetsuiteRecordSublist) {
    "use strict";
    /**
     * @class NetsuiteRecord
     * @classdesc A class wrapper to add some additional functionality to the native deployment record
     * object. Allows for dot notation access to fields, ex: SalesOrder.tranid, instead of calling
     * get/setField functions.
     * @property {record} api Native SuiteScript record object
     * @property {string[]} #fieldList List of available fields of the current record
     * @property {string[]} #sublists List of available sublists of the current record
     */
    class NetsuiteRecord {
        /**
         * @private
         * @type {string[]}
         */
        #fieldList = [];
        /**
         * @private
         * @type {string[]}
         */
        #sublists = [];
        /** @type {record} Native SuiteScript record object */
        nsAPI;
        constructor(nsRecord) {
            this.nsAPI = nsRecord;
            this.#fieldList = this.nsAPI.getFields();
            this.#sublists = this.nsAPI.getSublists();
            this.#buildFields();
            this.#buildSublists();
        }
        /**
         * @private
         * @method NetsuiteRecord#buildFields
         */
        #buildFields() {
            if (this.#fieldList.length > 0) {
                for (const fieldId of this.#fieldList) {
                    Object.defineProperties(this, {
                        [fieldId]: {
                            get: () => this.nsAPI.getValue({ fieldId: fieldId }),
                            set: (value) => this.nsAPI.setValue({ fieldId: fieldId, value: value }),
                            enumerable: true
                        },
                        [`${fieldId}TEXT`]: {
                            get: () => this.nsAPI.getText({ fieldId: fieldId }),
                            set: (value) => this.nsAPI.setText({ fieldId: fieldId, text: value }),
                            enumerable: true
                        }
                    });
                }
            }
        }
        #buildSublists() {
            if (this.#sublists.length > 0) {
                for (const sublistId of this.#sublists) {
                    this[sublistId] = new NetsuiteRecordSublist(sublistId, this.nsAPI);
                }
            }
        }
    }
    return NetsuiteRecord;
});
