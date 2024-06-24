"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getTimeSTamp = () => {
    return new Date().toISOString();
};
const info = (namespace, message, object) => {
    if (object) {
        console.log(`[${getTimeSTamp()}] [INFO] [${namespace}] ${message}`, object);
    }
    else {
        console.log(`[${getTimeSTamp()}] [INFO] [${namespace}] ${message}`);
    }
};
const warn = (namespace, message, object) => {
    if (object) {
        console.warn(`[${getTimeSTamp()}] [WARN] [${namespace}] ${message}`, object);
    }
    else {
        console.warn(`[${getTimeSTamp()}] [WARN] [${namespace}] ${message}`);
    }
};
const error = (namespace, message, object) => {
    if (object) {
        console.error(`[${getTimeSTamp()}] [ERROR] [${namespace}] ${message}`, object);
    }
    else {
        console.error(`[${getTimeSTamp()}] [ERROR] [${namespace}] ${message}`);
    }
};
const debug = (namespace, message, object) => {
    if (object) {
        console.debug(`[${getTimeSTamp()}] [DEBUG] [${namespace}] ${message}`, object);
    }
    else {
        console.debug(`[${getTimeSTamp()}] [DEBUG] [${namespace}] ${message}`);
    }
};
exports.default = {
    info,
    warn,
    error,
    debug
};
