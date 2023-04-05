export function keysToObject(obj: any, conversionFn: any, newObject?: any) {
    if (!obj) {
        return obj;
    }
    if (!newObject) {
        newObject = {};
    }

    Object.keys(obj).forEach(prop => {
        if (typeof obj[prop] === "object" && obj[prop]) {
            const convertObj = (newObject[conversionFn(prop)] = {});
            keysToObject(obj[prop], conversionFn, convertObj);
        } else {
            newObject[conversionFn(prop)] = obj[prop];
        }
    });
    return newObject;
}
