/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(["require", "exports", "N/log", "../script-utilities/NetsuiteRecord/NetsuiteRecord"], function (require, exports, log, NetsuiteRecord) {
    "use strict";
    const beforeLoad = (scriptContext) => {
        const rec = new NetsuiteRecord(scriptContext.newRecord);
        log.debug('Matt Testing', rec.tranid);
    };
    const MattTesting = {
        beforeLoad
    };
    return MattTesting;
});
