import { choferRepository } from "../repositories/choferRepository";

import { getUserIdFromToken } from "../utils/getUserIdFromToken";

export class ChoferService {
    choferRepo: choferRepository;
    constructor() {
        this.choferRepo = new choferRepository();
    }
     async getMisTurnos(token: string) {
         if (!token) {
            throw new Error("Token no enviado");
        }
        const id = getUserIdFromToken(token);

        return await this.choferRepo.getMisTurnos(id);
    }
}