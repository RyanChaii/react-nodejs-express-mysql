// Check for null, empty and is string
exports.checkValid = checkfield => {
  if (checkfield === null || checkfield === undefined || typeof checkfield !== "string" || checkfield.trim().length < 1 || checkfield.length < 1) {
    return false;
  } else {
    return true;
  }
};

// Check if field is string
exports.checkOptionalIsString = checkfield => {
  if (checkfield !== null) {
    if (checkfield !== undefined) {
      if (typeof checkfield !== "string") {
        return false;
      }
    }
  }
};
