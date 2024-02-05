onmessage = function (event) {
    const numbers = event.data;
    console.log('Received Numbers in Worker:', numbers);
    const result = calculateSumofSquare(numbers);
    postMessage(result);
}

function calculateSumofSquare(numbers) {
    let sum = 0;
    for (const number of numbers) {
        sum += Math.pow(number,2);
    }
    return sum;
}