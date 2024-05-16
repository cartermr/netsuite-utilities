/**
 * @NApiVersion 2.1
 */

import { Record as NsRecord } from 'N/record'

class NetsuiteRecordSublist extends Array {
    [index: number]: any
    [key: string]: any
    #fieldList: string[] = []
    #isDynamic: boolean
    nsAPI: NsRecord
    sublistId: string = ''
    linecount: number = 0

    constructor(sublistId: string, nsRecord: NsRecord, isDynamic: boolean) {
        super();
        this.nsAPI = nsRecord
        this.sublistId = sublistId
        this.#isDynamic = isDynamic
        this.linecount = this.nsAPI.getLineCount({sublistId: this.sublistId})
        this.#fieldList = this.nsAPI.getSublistFields({sublistId: this.sublistId})
        this.#buildSublistLines()
    }

    #buildSublistLines() {
        if (this.linecount > 0 && this.#fieldList.length > 0) {
            for (let lineNumber = 0; lineNumber < this.linecount; lineNumber++) {
                let newLine = {}
                for (const fieldId of this.#fieldList) {
                    Object.defineProperties(newLine, {
                        [fieldId]: {
                            get: () => {
                                if (this.#isDynamic) {
                                    this.nsAPI.selectLine({sublistId: this.sublistId, line: lineNumber})
                                    this.nsAPI.getCurrentSublistValue({sublistId: this.sublistId, fieldId: fieldId})
                                } else {
                                    this.nsAPI.getSublistValue({sublistId: this.sublistId, fieldId: fieldId, line: lineNumber})
                                }
                            },
                            set: (value: any) => {
                                if (this.#isDynamic) {
                                    this.nsAPI.selectLine({sublistId: this.sublistId, line: lineNumber})
                                    this.nsAPI.setCurrentSublistValue({sublistId: this.sublistId, fieldId, value: value})
                                    this.nsAPI.commitLine({sublistId: this.sublistId})
                                } else {
                                    this.nsAPI.setSublistValue({sublistId: this.sublistId, fieldId: fieldId, line: lineNumber, value: value})
                                }
                            },
                            enumerable: true
                        },
                        [`${fieldId}TEXT`]: {
                            get: () => this.nsAPI.getSublistText({sublistId: this.sublistId, fieldId: fieldId, line: lineNumber}),
                            set: (value: any) => this.nsAPI.setSublistText({sublistId: this.sublistId, fieldId: fieldId, line: lineNumber, text: value}),
                            enumerable: true
                        }
                    })
                }
            }
        }
    }
}

export = NetsuiteRecordSublist