import prisma from '../db.js';

/**
 * Original CPF Validator Logic from Laravel Functions.php
 */
export function validateCpf(param) {
    function validatingDigit(str) {
        let factor = str.length + 1;
        let total = 0;
        for (let i = 0; i < str.length; i++) {
            total += parseInt(str[i]) * factor--;
        }
        let rest = total % 11;
        let x = (rest === 10) ? 0 : Math.abs(11 - rest);
        return x;
    }

    function gear(str, strToMatch, onceFirst) {
        if (!onceFirst) {
            let substr = str.substring(0, 9);
            let x = validatingDigit(substr);
            if (x === parseInt(strToMatch.substring(9, 10))) {
                let substrNext = str.substring(0, 9) + str.substring(9, 10);
                return gear(substrNext, strToMatch, true);
            } else {
                return false;
            }
        } else {
            let substr = str;
            let x = validatingDigit(substr);
            if (x === parseInt(strToMatch.substring(10, 11))) {
                return true;
            } else {
                return false;
            }
        }
    }

    let cleanParam = param.replace(/[^0-9]/g, "");
    if (cleanParam.length === 11) {
        return gear(cleanParam, cleanParam, false);
    } else {
        return false;
    }
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
