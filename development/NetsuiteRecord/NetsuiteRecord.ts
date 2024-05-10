/**
 * @module NetsuiteRecord
 * @author Matt Carter
 * @description A custom module for SuiteScript 2.1 to help extend the capabilities of the native
 * Record object.
 * @NApiVersion 2.1
 */

import { Record as NsRecord, Field } from 'N/record'
import NetsuiteRecordSublist = require('./NetsuiteRecordSublist')

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
    #fieldList: string[] = []

    /**
     * @private
     * @type {string[]}
     */
    #sublists: string[] = []

    /**
     * @private
     * @type {number}
     */
    #id: number

    /** @type {record} Native SuiteScript record object */
    nsAPI: NsRecord

    constructor(nsRecord: NsRecord) {
        this.nsAPI = nsRecord
        this.#id = this.nsAPI.id
        this.#fieldList = this.nsAPI.getFields()
        this.#sublists = this.nsAPI.getSublists()
        this.#buildFields()
        this.#buildSublists()
    }

    get ID(): number { return this.#id }
    get fields(): string[] { return this.#fieldList }
    get sublists(): string[] { return this.#sublists }

    getField(fieldId: string): Field { return this.nsAPI.getField({fieldId: fieldId}) }

    save(enableSourcing: boolean = false, ignoreMandatoryFields: boolean = false): number | null {
        let savedRecID = this.nsAPI.save({enableSourcing: enableSourcing, ignoreMandatoryFields: ignoreMandatoryFields})
        if (savedRecID) {
            this.#id = savedRecID
            return savedRecID
        } else {
            return null
        }
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
                        get: () => this.nsAPI.getValue({fieldId: fieldId}),
                        set: (value: any, ignoreFieldChange: boolean = false) => this.nsAPI.setValue({fieldId: fieldId, value: value, ignoreFieldChange: ignoreFieldChange}),
                        enumerable: true
                    },
                    [`${fieldId}TEXT`]: {
                        get: () => this.nsAPI.getText({fieldId: fieldId}),
                        set: (value: any, ignoreFieldChange: boolean = false) => this.nsAPI.setText({fieldId: fieldId, text: value, ignoreFieldChange: ignoreFieldChange}),
                        enumerable: true
                    }
                })
            }
        }
    }

    #buildSublists() {
        if (this.#sublists.length > 0) {
            for (const sublistId of this.#sublists) {
                this[sublistId] = new NetsuiteRecordSublist(sublistId, this.nsAPI)
            }
        }
    }
}

export = NetsuiteRecord