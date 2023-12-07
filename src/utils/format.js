const dotNotationToObj = (obj, string, value) => {
  //both column name and header is present
  if (string && value) {
    //split headers by dot notation
    const stringArr = string.split(".");
    const key = stringArr[0];

    //add key if current key doesn't present on parent object
    if (!obj.hasOwnProperty(key)) {
      obj[key] = {};
    }

    //run same function for every key
    value =
      stringArr.length <= 1
        ? value
        : dotNotationToObj(obj[key], stringArr.slice(1).join("."), value);

    return {
      ...obj,
      [key]: value,
    };
  } else {
    return obj;
  }
};

module.exports = { dotNotationToObj };
