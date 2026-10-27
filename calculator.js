if (sessionStorage.getItem("umarPortalAuthenticated") !== "true") {
    window.location.replace("index.html");
}

const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");
const welcomeMessage = document.getElementById("welcome-message");

const username = sessionStorage.getItem("umarPortalUsername");
if (username) {
    welcomeMessage.textContent = `Welcome, ${username}`;
}

let storedValue = null;
let currentOperator = null;
let waitingForOperand = false;
let resetDisplay = false;

function enterNumber(number) {
    if (resetDisplay) {
        display.textContent = "0";
        resetDisplay = false;
    }

    if (waitingForOperand) {
        display.textContent = number;
        waitingForOperand = false;
    } else if (display.textContent === "0") {
        display.textContent = number;
    } else {
        display.textContent += number;
    }
}

function enterDecimal() {
    if (resetDisplay || waitingForOperand) {
        display.textContent = "0";
        resetDisplay = false;
        waitingForOperand = false;
    }

    if (!display.textContent.includes(".")) {
        display.textContent += ".";
    }
}

function calculate() {
    if (currentOperator === null || waitingForOperand) {
        return;
    }

    const rightValue = Number(display.textContent);
    let result;

    switch (currentOperator) {
        case "+":
            result = storedValue + rightValue;
            break;
        case "-":
            result = storedValue - rightValue;
            break;
        case "*":
            result = storedValue * rightValue;
            break;
        case "/":
            if (rightValue === 0) {
                display.textContent = "Cannot divide by zero";
                storedValue = null;
                currentOperator = null;
                waitingForOperand = false;
                resetDisplay = true;
                return;
            }
            result = storedValue / rightValue;
            break;
        default:
            return;
    }

    display.textContent = String(Number(result.toPrecision(10)));
    storedValue = null;
    currentOperator = null;
    waitingForOperand = false;
    resetDisplay = true;
}

function selectOperator(operator) {
    if (currentOperator && !waitingForOperand) {
        calculate();
    }

    storedValue = Number(display.textContent);
    currentOperator = operator;
    waitingForOperand = true;
    resetDisplay = false;
}

function clearCalculator() {
    display.textContent = "0";
    storedValue = null;
    currentOperator = null;
    waitingForOperand = false;
    resetDisplay = false;
}

function deleteLastDigit() {
    if (resetDisplay || waitingForOperand) {
        return;
    }

    display.textContent = display.textContent.length > 1
        ? display.textContent.slice(0, -1)
        : "0";
}

buttons.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) {
        return;
    }

    if (button.dataset.number !== undefined) {
        enterNumber(button.dataset.number);
    } else if (button.dataset.operator) {
        selectOperator(button.dataset.operator);
    } else {
        switch (button.dataset.action) {
            case "clear":
                clearCalculator();
                break;
            case "delete":
                deleteLastDigit();
                break;
            case "decimal":
                enterDecimal();
                break;
            case "equals":
                calculate();
                break;
        }
    }
});

document.getElementById("logout-button").addEventListener("click", () => {
    sessionStorage.removeItem("umarPortalUsername");
    sessionStorage.removeItem("umarPortalAuthenticated");
    window.location.href = "index.html";
});
