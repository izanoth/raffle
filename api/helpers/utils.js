import prisma from '../db.js';

/**
 * Validates strictly CPF (11 digits)
 */
export function validateCpf(cpf) {
    if (!cpf) return false;
    
    const cleanCpf = cpf.replace(/\D/g, "");

    // CPF must have exactly 11 digits and not be all identical digits
    if (cleanCpf.length !== 11 || /^(\d)\1{10}$/.test(cleanCpf)) {
        return false;
    }

    let sum = 0;
    let remainder;

    // Validate first digit
    for (let i = 1; i <= 9; i++) {
        sum = sum + parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;

    if (remainder !== parseInt(cleanCpf.substring(9, 10))) {
        return false;
    }

    // Validate second digit
    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum = sum + parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;

    if (remainder !== parseInt(cleanCpf.substring(10, 11))) {
        return false;
    }

    return true;
}

export async function generateTickets(units) {
    const tickets = [];
    for (let i = 0; i < units; i++) {
        let unique = false;
        while (!unique) {
            const randomNumber = Math.floor(1000 + Math.random() * 9000).toString();
            const exists = await prisma.client.findFirst({
                where: {
                    tickets: {
                        contains: `"${randomNumber}"`
                    }
                }
            });
            if (!exists) {
                tickets.push(randomNumber);
                unique = true;
            }
        }
    }
    return JSON.stringify(tickets);
}
