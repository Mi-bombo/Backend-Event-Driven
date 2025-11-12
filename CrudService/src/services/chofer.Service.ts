import { choferRepository } from "../repositories/choferRepository";

export class ChoferService {
    choferRepo: choferRepository;
    constructor() {
        this.choferRepo = new choferRepository();
    }
    
    async getMisTurnosByUserId(userId: number) {
        if (!userId) {
            throw new Error("UserId no proporcionado");
        }
        return await this.choferRepo.getMisTurnos(userId);
    }
}