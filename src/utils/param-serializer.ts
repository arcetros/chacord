export function serialize(a: Record<string, unknown>): string {
    const s: string[] = [];
    const rbracket = /\[\]$/;
    const isArray = function (obj: unknown) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    };

    function add(k: string, v: any) {
        v = typeof v === "function" ? v() : v === null ? "" : v === undefined ? "" : v;
        if (!v) return;
        s[s.length] = encodeURIComponent(k) + "=" + encodeURIComponent(v);
    }

    function buildParams(prefix: string, obj: any) {
        let i: number, len: number, key: string;

        if (prefix) {
            if (isArray(obj)) {
                for (i = 0, len = obj.length; i < len; i++) {
                    if (rbracket.test(prefix)) {
                        add(prefix, obj[i]);
                    } else {
                        console.log(obj[i], i);
                        buildParams(prefix + "[]", obj[i]);
                    }
                }
            } else if (obj && String(obj) === "[object Object]") {
                for (key in obj) {
                    buildParams(prefix + "[" + key + "]", obj[key]);
                }
            } else {
                add(prefix, obj);
            }
        } else if (isArray(obj)) {
            for (i = 0, len = obj.length; i < len; i++) {
                add(obj[i].name, obj[i].value);
            }
        } else {
            for (key in obj) {
                buildParams(key, obj[key]);
            }
        }
        return s;
    }

    return decodeURIComponent(buildParams("", a).join("&").replace(/%20/g, "+"));
}
