/* =========================================
   DevGenie UI Interactions - JavaScript
   Theme, Tabs, Scientific Calculator
   ========================================= */

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);

    // Animate transition
    document.body.style.transition = 'background 0.5s ease, color 0.5s ease';
}

// Load saved theme
document.addEventListener('DOMContentLoaded', function() {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
        document.body.classList.add('dark-mode');
    }
});

window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('preloader-hide');
            preloader.addEventListener('transitionend', () => {
                if (preloader.parentElement) {
                    preloader.parentElement.removeChild(preloader);
                }
            }, { once: true });
        }, 1200); // Increased from 700 to 1200ms
    }
});

// Parallax scrolling effect
let parallaxTicking = false;
window.addEventListener('scroll', function() {
    if (!parallaxTicking) {
        requestAnimationFrame(function() {
            const scrolled = window.pageYOffset;
            const shapes = document.querySelectorAll('.floating-shape');
            shapes.forEach((shape, index) => {
                const rate = (index + 1) * 0.3; // Different rates for each shape
                shape.style.transform = `translateY(${scrolled * rate}px)`;
            });
            parallaxTicking = false;
        });
        parallaxTicking = true;
    }
});

// Tab switching function
function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabId) {
            btn.classList.add('active');
        }
    });

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');

    // Focus input based on tab
    if (tabId === 'landCalc') {
        setTimeout(() => {
            const firstName = document.querySelector('#tableBody input[type="text"]');
            if (firstName) firstName.focus();
        }, 100);
    } else if (tabId === 'jomiConverter') {
        setTimeout(() => {
            const input = document.getElementById('inputValue2');
            if (input) input.focus();
        }, 100);
    } else if (tabId === 'scientificCalc') {
        setTimeout(() => {
            const input = document.getElementById('sciExpression');
            if (input) input.focus();
        }, 100);
    }
}

// Keyboard Help Modal
function showKeyboardHelp() {
    document.getElementById('keyboardModal').classList.add('show');
}

function hideKeyboardHelp() {
    document.getElementById('keyboardModal').classList.remove('show');
}

// Close modal on outside click
const keyboardModal = document.getElementById('keyboardModal');
if (keyboardModal) {
    keyboardModal.addEventListener('click', function(e) {
        if (e.target === this) {
            hideKeyboardHelp();
        }
    });
}

// Global Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Alt + 1, 2, 3 for tab switching
    if (e.altKey && e.key === '1') {
        e.preventDefault();
        switchTab('landCalc');
    } else if (e.altKey && e.key === '2') {
        e.preventDefault();
        switchTab('jomiConverter');
    } else if (e.altKey && e.key === '3') {
        e.preventDefault();
        switchTab('scientificCalc');
    }

    // Ctrl + T for theme toggle
    if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        toggleTheme();
    }

    // Ctrl + S for manual save
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        manualSave();
    }

    // Ctrl + L for manual load
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        manualLoad();
    }

    // Ctrl + N for add row
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        addRow();
    }

    // Escape to reset/close modal
    if (e.key === 'Escape') {
        hideKeyboardHelp();
        if (document.getElementById('jomiConverter').classList.contains('active')) {
            resetConverter2();
        }
    }
});

// Scientific Calculator Functions
function sciInput(val) {
    document.getElementById('sciExpression').value += val;
    document.getElementById('sciExpression').focus();
}

function sciClear() {
    document.getElementById('sciExpression').value = '';
    document.getElementById('sciResult').value = '';
}

function sciBackspace() {
    const input = document.getElementById('sciExpression');
    input.value = input.value.slice(0, -1);
}

function fact(value) {
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0 || Math.round(number) !== number) {
        return NaN;
    }
    let total = 1;
    for (let i = 2; i <= number; i++) {
        total *= i;
    }
    return total;
}

function sciCalculate() {
    const input = document.getElementById('sciExpression');
    const output = document.getElementById('sciResult');
    try {
        let expression = input.value.trim();
        if (!expression) {
            output.value = '';
            return;
        }

        // Normalize mathematical symbols
        expression = expression
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-')
            .replace(/√/g, 'Math.sqrt')
            .replace(/π/g, 'Math.PI');

        // Allow only safe calculator tokens and supported Math names
        const safePattern = /^\s*(?:(?:\d+(?:\.\d+)?)|Math\.(?:sin|cos|tan|sqrt|log|log10|pow|abs|exp|PI|E)|fact|[+\-*/%().]|\*\*|\s)*\s*$/;
        if (!safePattern.test(expression)) {
            output.value = 'Invalid input';
            return;
        }

        const result = new Function('fact', 'Math', `return ${expression}`)(fact, Math);
        output.value = typeof result === 'number' && Number.isFinite(result)
            ? result.toFixed(10).replace(/\.?0+$/, '')
            : 'Error';

        output.style.animation = 'none';
        output.offsetHeight;
        output.style.animation = 'resultPop 0.3s ease';
    } catch (e) {
        output.value = 'Error';
    }
}

// Scientific Calculator keyboard support
const sciExpressionField = document.getElementById('sciExpression');
if (sciExpressionField) {
    sciExpressionField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sciCalculate();
        }
    });
}

// Conversion Functions
function convertKmToMiles() {
    const km = parseFloat(document.getElementById('convKm').value) || 0;
    document.getElementById('convKmResult').textContent = (km * 0.621371).toFixed(4) + ' miles';
}

function convertKgToLbs() {
    const kg = parseFloat(document.getElementById('convKg').value) || 0;
    document.getElementById('convKgResult').textContent = (kg * 2.20462).toFixed(4) + ' lbs';
}

function convertCelsiusToF() {
    const celsius = parseFloat(document.getElementById('convCelsius').value) || 0;
    document.getElementById('convCelsiusResult').textContent = ((celsius * 9/5) + 32).toFixed(2) + '°F';
}

function convertTbspToMl() {
    const tbsp = parseFloat(document.getElementById('convTbsp').value) || 0;
    document.getElementById('convTbspResult').textContent = (tbsp * 14.787).toFixed(2) + ' ml';
}

function convertMeterToFeet() {
    const meters = parseFloat(document.getElementById('convMeter').value) || 0;
    document.getElementById('convMeterResult').textContent = (meters * 3.28084).toFixed(4) + ' ft';
}

function convertLiterToGallon() {
    const liters = parseFloat(document.getElementById('convLiter').value) || 0;
    document.getElementById('convLiterResult').textContent = (liters * 0.264172).toFixed(4) + ' gal';
}

function convertSqmToSqft() {
    const sqm = parseFloat(document.getElementById('convSqm').value) || 0;
    document.getElementById('convSqmResult').textContent = (sqm * 10.7639).toFixed(4) + ' sqft';
}

function convertMilesToKm() {
    const miles = parseFloat(document.getElementById('convMiles').value) || 0;
    document.getElementById('convMilesResult').textContent = (miles * 1.60934).toFixed(4) + ' km';
}

function convertLbsToKg() {
    const lbs = parseFloat(document.getElementById('convLbs').value) || 0;
    document.getElementById('convLbsResult').textContent = (lbs * 0.453592).toFixed(4) + ' kg';
}

function convertFahrenheitToC() {
    const fahrenheit = parseFloat(document.getElementById('convFahrenheit').value) || 0;
    document.getElementById('convFahrenheitResult').textContent = ((fahrenheit - 32) * 5/9).toFixed(2) + '°C';
}