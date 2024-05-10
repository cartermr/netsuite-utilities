/**
 * [Company/Project Name]
 * ---------------------------------------------------------------------------------------------------------------------
 * @author Matt Carter
 * @description SuiteScript UserEvent script template
 *
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */

import { EntryPoints } from 'N/types'

const beforeLoad: EntryPoints.UserEvent.beforeLoad = (scriptContext: EntryPoints.UserEvent.beforeLoadContext) => {}

const beforeSubmit: EntryPoints.UserEvent.beforeSubmit = (scriptContext: EntryPoints.UserEvent.beforeSubmitContext) => {}

const afterSubmit: EntryPoints.UserEvent.afterSubmit = (scriptContext: EntryPoints.UserEvent.afterSubmitContext) => {}

export = {
    beforeLoad,
    beforeSubmit,
    afterSubmit
}