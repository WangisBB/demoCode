const storage = localStorage;
let storageType = JSON.parse(storage.getItem("storageType") || "{}");
export const setStorage = (data) => {
    let str_json;
    Object.keys(data).forEach((prop) => {
        str_json = data[prop];
        storageType[prop] = typeof str_json;
        if (storageType[prop] === "object") {
            str_json = JSON.stringify(str_json);
        }
        storage.setItem(prop, str_json);
    });
    storage.setItem("storageType", JSON.stringify(storageType));
};

export const getStorage = (name) => {
    let str_json = storage.getItem(name),
        storageType = JSON.parse(storage.getItem("storageType") || "{}");
    // console.log(
    //     name,
    //     str_json,
    //     storageType,
    //     storage.getItem("storageType"),
    //     storageType[name]
    // );
    switch (storageType[name]) {
        case "object":
            return JSON.parse(str_json);
        case "number":
            return str_json - 0;
        case "boolean":
            return Boolean(str_json);
        default:
            return str_json;
    }
};

export const removeStorage = (name) => {
    storage.removeItem(name);
};