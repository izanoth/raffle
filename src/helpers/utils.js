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
