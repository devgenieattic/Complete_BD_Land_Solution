/* =========================================
   DevGenie Jomi Converter - JavaScript
   Land Measurement Unit Converter
   Fixed and Optimized
   ========================================= */

// Bangladesh Land Measurement Conversion Factors
// Base unit: Square Feet (বর্গফুট)

const CONVERSION_FACTORS = {
    // To Square Feet
    sqft: 1,
    decimal: 435.60,
    katha: 720, // 720 sqft per katha in Bangladesh (standard)
    bigha: 14374.8, // 33 decimal = 14374.8 sqft
    acre: 43560, // 100 decimal
    hectare: 107639, // 2.47105 acre
    sqm: 10.7639, // 1 sqm = 10.7639 sqft
    sqyd: 9 // 1 sqyd = 9 sqft
};

// Unit display names
const UNIT_NAMES = {
    decimal: { bn: 'শতক', en: 'Decimal' },
    katha: { bn: 'কাঠা', en: 'Katha' },
    bigha: { bn: 'বিঘা', en: 'Bigha' },
    acre: { bn: 'একর', en: 'Acre' },
    hectare: { bn: 'হেক্টর', en: 'Hectare' },
    sqft: { bn: 'বর্গফুট', en: 'Sq Ft' },
    sqm: { bn: 'বর্গমিটার', en: 'Sq M' },
    sqyd: { bn: 'বর্গগজ', en: 'Sq Yd' }
};

// Conversion table data
const CONVERSION_TABLE = [
    {
        unit: 'শতক (Decimal)',
        value: '1',
        toSqFt: '435.60',
        toSqM: '40.4686',
        toDecimal: '1'
    },
    {
        unit: 'কাঠা (Katha)',
        value: '1',
        toSqFt: '720',
        toSqM: '66.8902',
        toDecimal: '1.65'
    },
    {
        unit: 'বিঘা (Bigha)',
        value: '1',
        toSqFt: '14374.8',
        toSqM: '1335.6',
        toDecimal: '33'
    },
    {
        unit: 'একর (Acre)',
        value: '1',
        toSqFt: '43560',
        toSqM: '4046.8564',
        toDecimal: '100'
    },
    {
        unit: 'হেক্টর (Hectare)',
        value: '1',
        toSqFt: '107639',
        toSqM: '10000',
        toDecimal: '247.105'
    },
    {
        unit: 'বর্গফুট (Sq Ft)',
        value: '1',
        toSqFt: '1',
        toSqM: '0.0929',
        toDecimal: '0.0023'
    },
    {
        unit: 'বর্গমিটার (Sq M)',
        value: '1',
        toSqFt: '10.7639',
        toSqM: '1',
        toDecimal: '0.0247'
    },
    {
        unit: 'বর্গগজ (Sq Yd)',
        value: '1',
        toSqFt: '9',
        toSqM: '0.8361',
        toDecimal: '0.0206'
    }
];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Populate conversion table
    populateConversionTable();

    // Setup Jomi Converter (Tab 2) event listeners
    setupJomiConverterListeners();
});

// Setup Jomi Converter (Tab 2) event listeners
function setupJomiConverterListeners() {
    const inputValue2 = document.getElementById('inputValue2');
    const fromUnit2 = document.getElementById('fromUnit2');
    const toUnit2 = document.getElementById('toUnit2');

    if (!inputValue2 || !fromUnit2 || !toUnit2) return;

    // Input change events - auto convert
    inputValue2.addEventListener('input', convert2);
    inputValue2.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') convert2();
    });

    fromUnit2.addEventListener('change', convert2);
    toUnit2.addEventListener('change', convert2);
}

// Convert function for Tab 2 (Jomi Converter)
function convert2() {
    const inputValue = document.getElementById('inputValue2');
    const fromUnit = document.getElementById('fromUnit2');
    const toUnit = document.getElementById('toUnit2');
    const outputField = document.getElementById('outputValue2');

    if (!inputValue || !fromUnit || !toUnit || !outputField) return;

    const inputVal = inputValue.value;
    const fromUnitVal = fromUnit.value;
    const toUnitVal = toUnit.value;

    if (!inputVal || inputVal.trim() === '' || isNaN(parseFloat(inputVal))) {
        outputField.value = '';
        return;
    }

    const inputNum = parseFloat(inputVal);

    if (inputNum < 0) {
        outputField.value = 'Negative values not allowed';
        return;
    }

    if (inputNum > 1000000) {
        outputField.value = 'Value too large';
        return;
    }

    // Convert: First to sqft, then to target unit
    const valueInSqft = inputNum * CONVERSION_FACTORS[fromUnitVal];
    const result = valueInSqft / CONVERSION_FACTORS[toUnitVal];

    // Format result
    const formattedResult = formatNumber(result);
    outputField.value = formattedResult;

    // Add animation effect
    outputField.style.animation = 'none';
    outputField.offsetHeight;
    outputField.style.animation = 'resultPop 0.3s ease';
}

// Swap units for Tab 2
function swapUnits2() {
    const fromUnit = document.getElementById('fromUnit2');
    const toUnit = document.getElementById('toUnit2');

    if (!fromUnit || !toUnit) return;

    const temp = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = temp;

    // Convert with swapped units
    convert2();

    // Add swap animation
    const swapBtn = document.querySelector('.swap-btn');
    if (swapBtn) {
        swapBtn.style.animation = 'none';
        swapBtn.offsetHeight;
        swapBtn.style.animation = 'btnIconBounce 0.5s ease';
    }
}

// Reset converter for Tab 2
function resetConverter2() {
    const inputValue = document.getElementById('inputValue2');
    const outputField = document.getElementById('outputValue2');
    const fromUnit = document.getElementById('fromUnit2');
    const toUnit = document.getElementById('toUnit2');

    if (inputValue) inputValue.value = '';
    if (outputField) outputField.value = '';
    if (fromUnit) fromUnit.value = 'decimal';
    if (toUnit) toUnit.value = 'sqft';

    // Reset animation and focus
    if (inputValue) {
        inputValue.style.animation = 'none';
        inputValue.offsetHeight;
        inputValue.focus();
    }
}

// Populate conversion table
function populateConversionTable() {
    const tbody = document.getElementById('conversionTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    CONVERSION_TABLE.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.style.animationDelay = `${0.5 + index * 0.1}s`;
        tr.style.animation = 'fadeIn 0.5s ease-out both';
        tr.innerHTML = `
            <td>${row.unit}</td>
            <td>${row.value}</td>
            <td>${row.toSqFt}</td>
            <td>${row.toSqM}</td>
            <td>${row.toDecimal}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Format number to appropriate decimal places
function formatNumber(num) {
    if (num === 0) return '0';
    if (isNaN(num) || !isFinite(num)) return 'Error';

    // For very small numbers, use scientific notation
    if (Math.abs(num) < 0.0001) {
        return num.toExponential(4);
    }

    // For whole numbers
    if (num === Math.floor(num)) {
        return num.toString();
    }

    // For decimals, show up to 6 decimal places but trim trailing zeros
    let formatted = num.toFixed(6);
    formatted = parseFloat(formatted).toString();

    return formatted;
}

// Add CSS for result animation (inject if not present)
function injectAnimations() {
    if (document.getElementById('jomi-animations')) return;

    const style = document.createElement('style');
    style.id = 'jomi-animations';
    style.textContent = `
        @keyframes resultPop {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes btnIconBounce {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(180deg); }
        }
    `;
    document.head.appendChild(style);
}

// Inject animations on load
injectAnimations();