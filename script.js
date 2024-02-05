
let shuffledNumbers = [];

function createCircles() {
    const numberInput = document.querySelector('.input-text');
    const circleContainer = document.getElementById('circleContainer');
    circleContainer.innerHTML = '';
    const number = parseInt(numberInput.value);
    if (isNaN(number) || number <= 0) {
        alert('Please enter a valid positive number.');
        return;
    }

    // Create circles based on the entered number
    for (let i = 0; i < number; i++) {
        const circle = document.createElement('div');

        circle.className = 'circle';
        circle.setAttribute('contenteditable', 'true');
        circleContainer.appendChild(circle);
        circle.textContent = '0'; // Initial value, you can set it to any default value
        circle.setAttribute('data-value', '0');

        // Triggering reflow to apply the transition
        void circle.offsetWidth;

        // Show the circle with a delay for a nice transition effect
        setTimeout(() => {
            circle.style.opacity = '1';
        }, i * 100);
    }
}

function showManualInput() {
    const manualCheckbox = document.getElementById('manualCheckbox');
    const randomCheckbox = document.getElementById('randomCheckbox');

    if (manualCheckbox.checked) {
        const secondCard = document.getElementById('manualInputCard');
        secondCard.style.display = 'flex';
        const randomInputCard = document.getElementById('randomInputCard');
        randomInputCard.style.display = 'none';
        randomCheckbox.checked = false;

        secondCard.innerHTML = `
            <h4>Enter total numbers</h4>
            <input type="text" placeholder="Type here" class="input-text">
            <div class="button-container">
                <button class="enter-button" onclick="toggleTick(); createCircles()">&rarr;</button>
            </div>
        `;
    }
}

function showRandomInput() {
    const circleContainer = document.querySelector('.circle-container');
    const manualInputCircles = Array.from(circleContainer.querySelectorAll('.circle[contenteditable="true"]'));

    // Hide manual input circles
    manualInputCircles.forEach(circle => {
        circle.style.opacity = '0';
        circle.style.transition = 'opacity 0.5s ease-in-out';
    });

    setTimeout(() => {
        // Remove manual input circles from the DOM
        manualInputCircles.forEach(circle => circle.remove());

        // Continue with shuffling and displaying random circles
        // ...
    }, 500);
    const rangeCheckbox = document.getElementById('randomCheckbox');
    const manualCheckbox = document.getElementById('manualCheckbox');

    if (rangeCheckbox.checked) {
        const secondCard = document.getElementById('randomInputCard');
        secondCard.style.display = 'flex';
        const manualInputCard = document.getElementById('manualInputCard');
        manualInputCard.style.display = 'none';
        manualCheckbox.checked = false;

        secondCard.innerHTML = `
            <h4>Select range of numbers</h4>
            <div class="range-container">
                <label for="startNumber">From:</label>
                <input type="number" id="startNumber" placeholder="Start" class="input-number">
                <label for="endNumber">To:</label>
                <input type="number" id="endNumber" placeholder="End" class="input-number">
            </div>
            <div class="button-container">
                <button class="range-button" onclick="generateRandomNumbers()">Generate</button>
            </div>
        `;
    }
}

function generateRandomNumbers() {
    const startNumberInput = document.getElementById('startNumber');
    const endNumberInput = document.getElementById('endNumber');

    const startNumber = parseInt(startNumberInput.value);
    const endNumber = parseInt(endNumberInput.value);

    if (isNaN(startNumber) || isNaN(endNumber) || startNumber >= endNumber) {
        alert('Please enter a valid range (start should be less than end).');
        return;
    }

    const range = endNumber - startNumber + 1;
    shuffledNumbers = Array.from({ length: range }, (_, index) => startNumber + index);

    // Fisher-Yates shuffle
    for (let i = shuffledNumbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledNumbers[i], shuffledNumbers[j]] = [shuffledNumbers[j], shuffledNumbers[i]];
    }

    console.log('Shuffled Random Numbers:', shuffledNumbers);
}

function toggleTick() {
    const button = document.querySelector('.enter-button');
    button.classList.toggle('tick');

    if (button.classList.contains('tick')) {
        button.innerHTML = '✔️';
    } else {
        button.innerHTML = '&rarr;';
    }
}

function sort() {
    const circleContainer = document.querySelector('.circle-container');
    const circles = Array.from(circleContainer.querySelectorAll('.circle'));
    const manualCheckbox = document.getElementById('manualCheckbox');
    const randomCheckbox = document.getElementById('randomCheckbox');
    const isManualInput = manualCheckbox.checked || circles.some(circle => circle.getAttribute('contenteditable') === 'true');

    // Use shuffledNumbers only if it's not empty and there is no manual input
    const values = (!isManualInput && shuffledNumbers.length > 0)
        ? shuffledNumbers
        : circles.map(circle => parseInt(circle.textContent));

    // Sort the values
    values.sort((a, b) => a - b);

    // Calculate the spacing between circles
    const spacing = 5;
    console.log('Sorted Array:', values);

    if (isManualInput) {
        // Animate the transition of circles with smoothness
        circles.forEach((circle, index) => {
            const newPosition = index * spacing;
            circle.style.transition = 'transform 0.5s ease-in-out';
            circle.style.transform = `translateX(${newPosition}px)`;
        });

        setTimeout(() => {
            circles.forEach((circle, index) => {
                circle.textContent = values[index];
            });
        }, 500);
    }
    downloadCSV(values);

}

let worker;

async function processNumbers() {
    if (!worker) {
        worker = new Worker('worker.js');
        worker.onmessage = handleWorkerMessage;
    }

    const manualInput = document.getElementById('manualCheckbox').checked;

    let numbers;

    if (manualInput) {
        const circleContainer = document.querySelector('.circle-container');
        const circles = Array.from(circleContainer.querySelectorAll('.circle'));
        const values = circles.map(circle => parseInt(circle.textContent));
        numbers = values;
    } else {
        numbers = shuffledNumbers;
    }
    worker.postMessage(numbers);
}


function handleWorkerMessage(event) {
    const result = event.data;
    console.log('Sum of squares:', result);
    const sumDisplay = document.getElementById('sumDisplay');
    sumDisplay.textContent = `Sum: ${result}`;
}

function downloadCSV(values) {
    const csvContent = "data:text/csv;charset=utf-8," + values.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sorted_array.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

