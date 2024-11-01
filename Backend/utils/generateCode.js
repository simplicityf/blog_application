// Function to generate a numeric code of a specified length
const generateCode = (codelength) => {
    // Generate a random number, convert it to a string, and remove the "0." part
    const number = Math.random().toString().split(".")[1]; // Corrected to properly split after decimal

    // Set default code length to 4 if not provided
    if (!codelength) {
        codelength = 4;
    }

    let code = "";  // Initialize an empty string for the final code

    // Generate the code by appending digits from the random number string
    for (let i = 0; i < codelength; i++) {
        // Loop through and append digits to code. Using modulo if random number isn't long enough
        code += number[i % number.length];
    }

    return code;  // Return the final code
}

module.exports = generateCode;
