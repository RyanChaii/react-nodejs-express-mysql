// Generate audit trail
exports.generateAudit = (uid, state, message) => {
    // 80 * -
    var divder = "--------------------------------------------------------------------------------";
    var dateTime = new Date(Date.now()).toLocaleString();
    var trailMsg = "\n" + divder + "\n" + "UserId: " + String(uid) + " State: " + String(state).toUpperCase() + "  DateTime: " + dateTime + "\n\n" + String(message);
    return trailMsg;
};