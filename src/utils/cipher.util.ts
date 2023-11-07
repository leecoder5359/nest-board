import { compare, hash } from 'bcrypt';

export class CipherUtil {
    static async hashText(plainText: string): Promise<string> {
        return hash(plainText, 10);
    }

    static async isHashValid(password: string, hashPassword: string): Promise<boolean> {
        return compare(password, hashPassword);
    }
}
