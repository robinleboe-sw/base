/**
 * Conversion function to transform Map to Object
 * @param strMap
 * @returns {Object}
 */
export function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    // We don’t escape the key '__proto__'
    // which can cause problems on older engines
    obj[k] = v;
  }
  return obj;
}

/**
 * Conversion function to transform Object to Map
 * @param obj
 * @returns {Map}
 */
export function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}
