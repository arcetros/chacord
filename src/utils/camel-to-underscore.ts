export function camelToUnderscore(str: string) {
    return str
        .replace(/\W+/g, "-")
        .replace(/([a-z\d])([A-Z])/g, "$1_$2")
        .toLowerCase();
}
