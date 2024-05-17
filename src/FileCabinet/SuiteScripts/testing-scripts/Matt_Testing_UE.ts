/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */

import { EntryPoints } from 'N/types'
import record = require('N/record')
import log = require('N/log')
import NetsuiteRecord = require('../script-utilities/NetsuiteRecord/NetsuiteRecord')

const beforeLoad: EntryPoints.UserEvent.beforeLoad = (scriptContext: EntryPoints.UserEvent.beforeLoadContext) => {
    const rec = new NetsuiteRecord(scriptContext.newRecord)
    log.debug('Matt Testing', rec.tranid)

}

const MattTesting = {
    beforeLoad
}

export = MattTesting