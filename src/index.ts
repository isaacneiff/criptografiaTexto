import * as crypto from 'crypto';

function splitEncryptedText(encryptedText: string) {
    return {
        ivString: encryptedText.slice(0, 32),
        encryptedDataString: encryptedText.slice(32),
    }
}

class Security {
    encoding: BufferEncoding = 'hex';
    key: string = '12345678901234567890123456789012'; // Exemplo de chave de 32 bytes, você deve usar uma chave segura

    encrypt(plaintext: string): string {
        try {
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.key), iv);

            const encrypted = Buffer.concat([
                cipher.update(plaintext, 'utf-8'),
                cipher.final(),
            ]);

            return iv.toString(this.encoding) + encrypted.toString(this.encoding);
        } catch (e) {
            console.error(e);
            throw e;
        }
    };

    decrypt(cipherText: string): string {
        const { encryptedDataString, ivString } = splitEncryptedText(cipherText);

        try {
            const iv = Buffer.from(ivString, this.encoding);
            const encryptedText = Buffer.from(encryptedDataString, this.encoding);
            const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.key), iv);

            const decrypted = Buffer.concat([
                decipher.update(encryptedText),
                decipher.final(),
            ]);
            return decrypted.toString();
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}

const security = new Security();

// Texto a ser criptografado
const textoOriginal = 'Será que o contrario de Minas gerais é caras especificos?';

// Criptografa o texto
const textoCriptografado = security.encrypt(textoOriginal);
console.log('Texto Criptografado:', textoCriptografado);

// Descriptografa o texto
const textoDescriptografado = security.decrypt(textoCriptografado);
console.log('Texto Descriptografado:', textoDescriptografado);
