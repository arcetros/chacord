export function keysToObject(obj: any, conversionFn: any, newObject: any = {}) {
    if (!obj) {
        return obj;
    }

    Object.keys(obj).forEach(prop => {
        if (typeof obj[prop] === "object" && obj[prop] !== null) {
            if (/^\d+$/.test(prop)) {
                // treat as array index
                if (!Array.isArray(newObject)) {
                    newObject = [];
                }
                newObject[prop] = keysToObject(obj[prop], conversionFn);
            } else {
                // treat as object property
                newObject[conversionFn(prop)] = keysToObject(obj[prop], conversionFn);
            }
        } else {
            newObject[conversionFn(prop)] = obj[prop];
        }
    });
    return newObject;
}
