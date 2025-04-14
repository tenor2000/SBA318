function isValidMatchingObject(inputObj, matchObject) {
  const matchKeys = Object.keys(matchObject);
  const inputKeys = Object.keys(inputObj);

  if (matchKeys.length !== inputKeys.length) {
    return false;
  }

  return requiredKeys.every((key) => inputKeys.includes(key));
}

module.exports = isValidMatchingObject;
