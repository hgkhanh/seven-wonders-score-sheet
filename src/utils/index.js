/**
 * Generate random integer number without repeating a list of given number
 * @param {number} digit - the number of digit of output number
 * @param {string[]} excludeNumbers - the number to exclude
 * @return {string} the random number
 */
export const  generateRoomCode = (digit, excludeNumbers) => {
    const min = 0;
    const max = Math.pow(10, digit);
    let random = '0';
    do {
        random = (Math.floor(Math.random() * (max-min)) + min) + '';
        // Add leading zero if not enough digit
        while (random.length < digit) {
            random = '0' + random;
        }
    } while (excludeNumbers.indexOf(random) > -1)
    
    return random;
}
