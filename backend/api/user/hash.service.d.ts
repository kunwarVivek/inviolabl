export declare class HashService {
    hashPassword(password: string): Promise<any>;
    comparePassword(password: string, hash: any): Promise<any>;
}
