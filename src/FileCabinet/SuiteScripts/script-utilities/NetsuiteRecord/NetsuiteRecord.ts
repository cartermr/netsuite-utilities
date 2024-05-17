/**
 * @module NetsuiteRecord
 * @author Matt Carter
 * @description A custom module for SuiteScript 2.1 to help extend the capabilities of the native
 * Record object.
 * @NApiVersion 2.1
 */

import { Record as NsRecord, FieldValue, Field } from 'N/record'
import nsError = require('N/error')
import log = require('N/log')

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
    [key: string]: any

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
     * @type {number | null}
     */
    #ID: number | null = null

    /**
     * @private
     * @type {boolean}
     */
    #isDynamic: boolean = false

    /** @type {record} Native SuiteScript record object */
    nsAPI: NsRecord

    constructor(nsRecord: NsRecord) {
        this.nsAPI = nsRecord
        this.#ID = this.nsAPI.id
        this.#fieldList = this.nsAPI.getFields()
        this.#sublists = this.nsAPI.getSublists()
        this.#buildFields()
        this.#buildSublists()
    }

    get ID(): number | null { return this.#ID }
    get fields(): string[] { return this.#fieldList }
    get sublists(): string[] { return this.#sublists }
    get isDynamic(): boolean { return  this.#isDynamic }

    getField(fieldId: string): Field { return this.nsAPI.getField({fieldId: fieldId}) }

    save(): number {
        let savedRecID: number | null = null
        try {
            savedRecID = this.nsAPI.save()
            this.#ID = savedRecID
            return savedRecID
        } catch (error) {
            throw nsError.create({
                name: 'NETSUITE_RECORD_UTILITY_FAILED_SAVE',
                message: `This record failed to save: ${error}`
            })
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
                        get: (): FieldValue => this.nsAPI.getValue({fieldId: fieldId}),
                        set: (value: string | number | null) => this.nsAPI.setValue({fieldId: fieldId, value: value}),
                        enumerable: true
                    },
                    [`${fieldId}TEXT`]: {
                        get: (): FieldValue => this.nsAPI.getText({fieldId: fieldId}),
                        set: (text: string) => this.nsAPI.setText({fieldId: fieldId, text: text}),
                        enumerable: true
                    }
                })
            }
        }
    }

    #buildSublists() {
        if (this.#sublists.length > 0) {
            for (const sublistId of this.#sublists) {
                this[sublistId] = new NetsuiteRecordSublist(sublistId, this.nsAPI, this.#isDynamic)
            }
        }
    }
}

export = NetsuiteRecord