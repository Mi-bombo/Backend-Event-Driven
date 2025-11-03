
export interface Token {
    token?:string
}

export interface IUbication {
    localidad?: string | null;
    departamento?: string | null;
    provincia?: string | null;
}

export interface IUser extends Token, IUbication{
    id: string;
    nombre: string;
    email: string;
    password_hash: string;
    role_id:string;
    fecha_creacion?: Date;
    fecha_actualizacion?: Date;
}