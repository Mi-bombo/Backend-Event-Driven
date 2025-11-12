"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHttpError = exports.HttpError = void 0;
class HttpError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}
exports.HttpError = HttpError;
const isHttpError = (error) => error instanceof HttpError;
exports.isHttpError = isHttpError;
