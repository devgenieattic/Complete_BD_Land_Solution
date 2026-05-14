/* =========================================
   DevGenie Utilities - Modern Features
   Bangla Digits, Animations, Smart Features
   ========================================= */

// Bangla Digit Mapping
const banglaDigits = {
    '0': '০',
    '1': '১',
    '2': '২',
    '3': '৩',
    '4': '৪',
    '5': '৫',
    '6': '৬',
    '7': '৭',
    '8': '৮',
    '9': '৯',
    '.': '.',
    '-': '-'
};

// Convert number to Bangla digits
function toBanglaDigits(str) {
    return str.toString().split('').map(char => banglaDigits[char] || char).join('');
}

// Convert Bangla digits back to English
function fromBanglaDigits(str) {
    const reverseMap = Object.fromEntries(Object.entries(banglaDigits).map(([k, v]) => [v, k]));
    return str.split('').map(char => reverseMap[char] || char).join('');
}

// Apply Bangla digits to all numeric inputs and outputs
function applyBanglaDigits() {
    // For outputs and results - convert displayed text
    const convertOutputs = () => {
        document.querySelectorAll('.rowShare, #grandTotalShare, #sciResult, #outputValue2').forEach(el => {
            const text = el.textContent || el.value;
            if (text && /\d/.test(text)) {
                const banglaText = toBanglaDigits(text);
                if (el.tagName === 'INPUT') {
                    el.value = banglaText;
                } else {
                    el.textContent = banglaText;
                }
            }
        });
    };

    // Convert on load and after calculations
    convertOutputs();
    // Re-convert after any calculation (listen for changes)
    const observer = new MutationObserver(convertOutputs);
    document.querySelectorAll('.rowShare, #grandTotalShare, #sciResult, #outputValue2').forEach(el => {
        observer.observe(el, { childList: true, subtree: true, characterData: true });
    });
}

// Smart features: Auto-save land calculator data
function autoSaveData() {
    const saveData = () => {
        const rows = [];
        document.querySelectorAll('#tableBody tr').forEach(row => {
            const name = row.querySelector('input[type="text"]').value;
            const ana = row.querySelector('.ana-num').value;
            const gonda = row.querySelector('.gonda-num').value;
            const kora = row.querySelector('.kora-num').value;
            const kranti = row.querySelector('.kranti-num').value;
            const til = row.querySelector('.til-num').value;
            rows.push({ name, ana, gonda, kora, kranti, til });
        });
        localStorage.setItem('landCalcData', JSON.stringify(rows));
    };

    // Save on input change
    document.addEventListener('input', saveData);
    // Save on page unload
    window.addEventListener('beforeunload', saveData);
}

// Load saved data
function loadSavedData() {
    const saved = localStorage.getItem('landCalcData');
    if (saved) {
        const rows = JSON.parse(saved);
        // Clear existing rows except first
        const tbody = document.getElementById('tableBody');
        while (tbody.children.length > 1) {
            tbody.removeChild(tbody.lastChild);
        }
        // Load data
        rows.forEach((rowData, index) => {
            if (index === 0) {
                // First row
                const firstRow = tbody.querySelector('tr');
                firstRow.querySelector('input[type="text"]').value = rowData.name;
                firstRow.querySelector('.ana-num').value = rowData.ana;
                firstRow.querySelector('.gonda-num').value = rowData.gonda;
                firstRow.querySelector('.kora-num').value = rowData.kora;
                firstRow.querySelector('.kranti-num').value = rowData.kranti;
                firstRow.querySelector('.til-num').value = rowData.til;
            } else {
                addRow();
                const newRow = tbody.lastElementChild;
                newRow.querySelector('input[type="text"]').value = rowData.name;
                newRow.querySelector('.ana-num').value = rowData.ana;
                newRow.querySelector('.gonda-num').value = rowData.gonda;
                newRow.querySelector('.kora-num').value = rowData.kora;
                newRow.querySelector('.kranti-num').value = rowData.kranti;
                newRow.querySelector('.til-num').value = rowData.til;
            }
        });
        calculate();
        updateStats();
    }
}

// Interactive animations
function addInteractiveAnimations() {
    // Add subtle ripple effect to buttons
    document.querySelectorAll('button').forEach(btn => {
        if (btn.classList.contains('ripple-enabled')) return;
        btn.classList.add('ripple-enabled');
        
        btn.addEventListener('click', function(e) {
            const existingRipple = this.querySelector('.ripple-effect');
            if (existingRipple) return;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            this.appendChild(ripple);

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
            ripple.style.top = e.clientY - rect.top - size / 2 + 'px';

            setTimeout(() => ripple.remove(), 800);
        });
    });

    // Add floating animation to shapes
    const shapes = document.querySelectorAll('.floating-shape');
    shapes.forEach((shape, index) => {
        shape.style.animationDelay = `${index * 2}s`;
        shape.style.animation = `float 20s ease-in-out infinite`;
    });

    // Add smooth focus effects to inputs and selects
    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('focus', function() {
            const parent = this.closest('.dual-input, .name-cell, .form-group');
            if (parent) parent.classList.add('input-focused');
        });
        input.addEventListener('blur', function() {
            const parent = this.closest('.dual-input, .name-cell, .form-group');
            if (parent) parent.classList.remove('input-focused');
        });
    });

    // Add loading spinner for calculations - wrap the calculate function
    const wrapCalculate = () => {
        if (window.calculate && !window.calculate.wrapped) {
            const originalCalculate = window.calculate;
            window.calculate = function() {
                const spinner = document.createElement('div');
                spinner.className = 'loading-spinner';
                spinner.innerHTML = '<div class="spinner"></div>';
                document.body.appendChild(spinner);

                setTimeout(() => {
                    originalCalculate();
                    spinner.style.opacity = '0';
                    setTimeout(() => spinner.remove(), 300);
                }, 50);
            };
            window.calculate.wrapped = true;
        } else if (!window.calculate) {
            // Retry after a short delay
            setTimeout(wrapCalculate, 100);
        }
    };
    wrapCalculate();
}

// Initialize modern features
document.addEventListener('DOMContentLoaded', function() {
    applyBanglaDigits();
    autoSaveData();
    loadSavedData();
    addInteractiveAnimations();
});

// Manual Save Function
function manualSave() {
    const rows = [];
    document.querySelectorAll('.land-row').forEach(row => {
        const inputs = row.querySelectorAll('input');
        const rowData = {
            ana: inputs[0].value,
            kora: inputs[1].value,
            kranti: inputs[2].value,
            til: inputs[3].value
        };
        rows.push(rowData);
    });
    localStorage.setItem('landCalcData', JSON.stringify(rows));
    showNotification('Data saved successfully!', 'success');
}

// Manual Load Function
function manualLoad() {
    const saved = localStorage.getItem('landCalcData');
    if (saved) {
        const rows = JSON.parse(saved);
        // Clear existing rows
        document.querySelectorAll('.land-row').forEach(row => row.remove());
        rowCount = 0;
        // Load saved rows
        rows.forEach(rowData => {
            addRow(rowData.ana, rowData.kora, rowData.kranti, rowData.til);
        });
        showNotification('Data loaded successfully!', 'success');
    } else {
        showNotification('No saved data found!', 'error');
    }
}

// Notification Function
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    if (type === 'success') {
        notification.style.backgroundColor = '#4CAF50';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#f44336';
    } else {
        notification.style.backgroundColor = '#2196F3';
    }
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}