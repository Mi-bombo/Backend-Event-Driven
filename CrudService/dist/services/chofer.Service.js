"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChoferService = void 0;
const choferRepository_1 = require("../repositories/choferRepository");
class ChoferService {
    constructor() {
        this.choferRepo = new choferRepository_1.choferRepository();
    }
    async getMisTurnosByUserId(userId) {
        if (!userId) {
            throw new Error("UserId no proporcionado");
        }
        return await this.choferRepo.getMisTurnos(userId);
    }
}
exports.ChoferService = ChoferService;
