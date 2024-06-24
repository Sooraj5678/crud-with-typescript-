const getTimeSTamp = (): string => {
    return new Date().toISOString();
};

const info = (namespace: string, message: string, object?: any) => {
    if (object) {
        console.log(`[${getTimeSTamp()}] [INFO] [${namespace}] ${message}`, object);
    } else {
        console.log(`[${getTimeSTamp()}] [INFO] [${namespace}] ${message}`);
    }
};
const warn = (namespace: string, message: string, object?: any) => {
    if (object) {
        console.warn(`[${getTimeSTamp()}] [WARN] [${namespace}] ${message}`, object);
    } else {
        console.warn(`[${getTimeSTamp()}] [WARN] [${namespace}] ${message}`);
    }
};
const error = (namespace: string, message: string, object?: any) => {
    if (object) {
        console.error(`[${getTimeSTamp()}] [ERROR] [${namespace}] ${message}`, object);
    } else {
        console.error(`[${getTimeSTamp()}] [ERROR] [${namespace}] ${message}`);
    }
};
const debug = (namespace: string, message: string, object?: any) => {
    if (object) {
        console.debug(`[${getTimeSTamp()}] [DEBUG] [${namespace}] ${message}`, object);
    } else {
        console.debug(`[${getTimeSTamp()}] [DEBUG] [${namespace}] ${message}`);
    }
};

export default {
    info,
    warn,
    error,
    debug
};
