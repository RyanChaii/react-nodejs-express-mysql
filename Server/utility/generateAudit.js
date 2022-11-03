// Generate audit trail
exports.generateAudit = (uid, state, message) => {
  var dateTime = new Date(Date.now()).toLocaleString();
  var trailMsg = "\n\n" + "UserId: " + String(uid) + " State: " + String(state).toUpperCase() + "  DateTime: " + dateTime + "\n\n" + String(message);
  return trailMsg;
};
