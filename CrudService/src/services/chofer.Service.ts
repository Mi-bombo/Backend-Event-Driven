import { choferRepository } from "../repositories/choferRepository";

export class ChoferService {
    choferRepo: choferRepository;
    constructor() {
        this.choferRepo = new choferRepository();
    }
     async getMisTurnos(id_user: number) {
        if (!id_user) throw new Error("Falta el ID del chofer.");
        return await this.choferRepo.getMisTurnos(id_user);
    }
}