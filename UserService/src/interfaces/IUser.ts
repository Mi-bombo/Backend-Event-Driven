
export interface Token {
    token?:string
}

export interface IUbication {
    localidad?: string | null;
    departamento?: string | null;
    provincia?: string | null;
}

export interface IUser extends Token, IUbication{
    id: number;
    nombre: string;
    email: string;
    password_hash: string;
    rol_id: number;
    fecha_creacion?: Date;
}