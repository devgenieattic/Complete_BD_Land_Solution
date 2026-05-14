/* =========================================
   DevGenie Land Calculator - App JavaScript
   Modern Interactive Functionality
   ========================================= */

// Global State
let rowCount = 0;

// Constants for Land Calculation
const ANA_TIL = 4800;
const MAX_TIL_16_ANA = 16 * ANA_TIL;

// Bengali Number Symbol Mappings
const anaSymbols = {
    0: "সিলেক্ট",
    1: "/",
    2: "৵",
    3: "৶",
    4: "৷",
    5: "৷⁄",
    6: "৷৵",
    7: "৷৶",
    8: "৷৷",
    9: "৷৷⁄",
    10: "৷৷৵",
    11: "৷৷৶",
    12: "৸",
    13: "৸⁄",
    14: "৸৵",
    15: "৸৶",
    16: "১্"
};

const koraSymbols = {
    0: "সিলেক্ট",
    1: "৷",
    2: "৷৷",
    3: "৸"
};

const krantiSymbols = {
    0: "সিলেক্ট",
    1: "৴",
    2: "৴৴"
};

// Initialize Application
function init() {
    // Add initial rows with staggered animation
    for (let i = 0; i < 5; i++) {
        setTimeout(() => addRow(), i * 100);
    }
}

// Add New Row (optionally after a specific row)
function addRow(afterRowId = null) {
    rowCount++;
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;

    const row = document.createElement('tr');
    row.setAttribute('id', `row-${rowCount}`);
    row.classList.add('new-row');
    row.tabIndex = 0;

    // Generate options for dropdowns
    const anaOptions = Object.entries(anaSymbols)
        .map(([k, v]) => `<option value="${k}">${v}</option>`)
        .join('');

    const gondaOptions = '<option value="0">সিলেক্ট</option>' +
        Array.from({ length: 20 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('');

    const koraOptions = Object.entries(koraSymbols)
        .map(([k, v]) => `<option value="${k}">${v}</option>`)
        .join('');

    const krantiOptions = Object.entries(krantiSymbols)
        .map(([k, v]) => `<option value="${k}">${v}</option>`)
        .join('');

    const tilOptions = '<option value="0">সিলেক্ট</option>' +
        Array.from({ length: 20 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('');

    // Create row HTML
    row.innerHTML = `
        <td>
            <div class="name-cell">
                <button class="dup-btn" onclick="duplicateRow(${rowCount})" title="Duplicate (Ctrl+D)" aria-label="Duplicate row">
                    D
                </button>
                <input type="text"
                       value="মালিক- ${rowCount}"
                       id="name-${rowCount}"
                       aria-label="Owner name"
                       placeholder="Enter name"
                       maxlength="50"
                       oninput="validateName(this)"
                       onkeydown="handleRowKeydown(event, ${rowCount})">
            </div>
        </td>
        <td>
            <div class="dual-input">
                <select class="select-box ana-select"
                        onchange="syncInput(${rowCount}, 'ana', 'select')"
                        aria-label="Ana symbol">
                    ${anaOptions}
                </select>
                <input type="number"
                       class="num-input ana-num"
                       min="0"
                       max="16"
                       placeholder="0"
                       oninput="syncInput(${rowCount}, 'ana', 'num')"
                       onkeydown="handleRowKeydown(event, ${rowCount})"
                       aria-label="Ana number">
            </div>
        </td>
        <td>
            <div class="dual-input">
                <select class="select-box gonda-select"
                        onchange="syncInput(${rowCount}, 'gonda', 'select')"
                        aria-label="Gonda number">
                    ${gondaOptions}
                </select>
                <input type="number"
                       class="num-input gonda-num"
                       min="0"
                       max="20"
                       placeholder="0"
                       oninput="syncInput(${rowCount}, 'gonda', 'num')"
                       onkeydown="handleRowKeydown(event, ${rowCount})"
                       aria-label="Gonda value">
            </div>
        </td>
        <td>
            <div class="dual-input">
                <select class="select-box kora-select"
                        onchange="syncInput(${rowCount}, 'kora', 'select')"
                        aria-label="Kora symbol">
                    ${koraOptions}
                </select>
                <input type="number"
                       class="num-input kora-num"
                       min="0"
                       max="3"
                       placeholder="0"
                       oninput="syncInput(${rowCount}, 'kora', 'num')"
                       onkeydown="handleRowKeydown(event, ${rowCount})"
                       aria-label="Kora number">
            </div>
        </td>
        <td>
            <div class="dual-input">
                <select class="select-box kranti-select"
                        onchange="syncInput(${rowCount}, 'kranti', 'select')"
                        aria-label="Kranti symbol">
                    ${krantiOptions}
                </select>
                <input type="number"
                       class="num-input kranti-num"
                       min="0"
                       max="2"
                       placeholder="0"
                       oninput="syncInput(${rowCount}, 'kranti', 'num')"
                       onkeydown="handleRowKeydown(event, ${rowCount})"
                       aria-label="Kranti number">
            </div>
        </td>
        <td>
            <div class="dual-input">
                <select class="select-box til-select"
                        onchange="syncInput(${rowCount}, 'til', 'select')"
                        aria-label="Til number">
                    ${tilOptions}
                </select>
                <input type="number"
                       class="num-input til-num"
                       min="0"
                       max="20"
                       placeholder="0"
                       oninput="syncInput(${rowCount}, 'til', 'num')"
                       onkeydown="handleRowKeydown(event, ${rowCount})"
                       aria-label="Til value">
            </div>
        </td>
        <td class="rowTotalTil">0</td>
        <td>
            <span class="rowShare"
                  onclick="copyValue(this)"
                  title="Click to copy (Enter)"
                  role="button"
                  tabindex="0"
                  onkeypress="if(event.key === 'Enter') copyValue(this)"
                  data-row="${rowCount}">
                0.00000
            </span>
        </td>
        <td>
            <button class="del-btn"
                    onclick="deleteRow(${rowCount})"
                    title="Delete row"
                    aria-label="Delete row">
                মুছুন
            </button>
        </td>
    `;

    // Insert row after specific row or at end
    if (afterRowId) {
        const afterRow = document.getElementById(`row-${afterRowId}`);
        if (afterRow && afterRow.nextSibling) {
            tbody.insertBefore(row, afterRow.nextSibling);
        } else {
            tbody.appendChild(row);
        }
    } else {
        tbody.appendChild(row);
    }

    // Remove animation class after animation completes
    setTimeout(() => {
        row.classList.remove('new-row');
    }, 400);

    // Calculate totals
    calculate();
    updateStats();

    // Focus on the new row's name input
    setTimeout(() => {
        const nameInput = document.getElementById(`name-${rowCount}`);
        if (nameInput) nameInput.focus();
    }, 100);

    return rowCount;
}

// Handle keyboard navigation within rows
function handleRowKeydown(event, rowId) {
    const rows = document.querySelectorAll('#tableBody tr');
    const currentRow = document.getElementById(`row-${rowId}`);
    const currentIndex = Array.from(rows).indexOf(currentRow);

    if (event.key === 'ArrowDown' && currentIndex < rows.length - 1) {
        event.preventDefault();
        const nextRow = rows[currentIndex + 1];
        const firstInput = nextRow.querySelector('input[type="text"]');
        if (firstInput) firstInput.focus();
    } else if (event.key === 'ArrowUp' && currentIndex > 0) {
        event.preventDefault();
        const prevRow = rows[currentIndex - 1];
        const firstInput = prevRow.querySelector('input[type="text"]');
        if (firstInput) firstInput.focus();
    } else if (event.key === 'Tab' && !event.shiftKey) {
        // Let default tab behavior work, but could add custom handling
    }
}

// Sync Input Between Select and Number Input
function syncInput(id, field, type) {
    const row = document.getElementById(`row-${id}`);
    if (!row) return;

    const select = row.querySelector(`.${field}-select`);
    const numInput = row.querySelector(`.${field}-num`);

    if (!select || !numInput) return;

    if (type === 'select') {
        numInput.value = select.value;
    } else {
        // Validate and sync number input to select
        const val = parseInt(numInput.value) || 0;
        const maxVal = getFieldMax(field);
        numInput.value = Math.min(Math.max(0, val), maxVal);
        select.value = numInput.value || 0;
    }

    calculate();
}

// Get Maximum Value for Field
function getFieldMax(field) {
    switch (field) {
        case 'ana': return 16;
        case 'gonda': return 20;
        case 'kora': return 3;
        case 'kranti': return 2;
        case 'til': return 20;
        default: return 0;
    }
}

// Validate Name Input
function validateName(input) {
    // Allow letters, numbers, spaces, hyphens, apostrophes
    input.value = input.value.replace(/[^a-zA-Z0-9\s\-']/g, '');
}

// Duplicate Row - inserts new row immediately after the current row
function duplicateRow(id) {
    const oldRow = document.getElementById(`row-${id}`);
    if (!oldRow) return;

    // Add new row immediately after the current row
    addRow(id);
    const newRow = document.getElementById(`row-${rowCount}`);

    if (!newRow) return;

    // Copy values from old row to new row
    const fields = ['ana', 'gonda', 'kora', 'kranti', 'til'];
    fields.forEach(f => {
        const numInput = oldRow.querySelector(`.${f}-num`);
        const select = oldRow.querySelector(`.${f}-select`);
        const newNumInput = newRow.querySelector(`.${f}-num`);
        const newSelect = newRow.querySelector(`.${f}-select`);

        if (numInput && newNumInput) {
            newNumInput.value = numInput.value;
        }
        if (select && newSelect) {
            newSelect.value = select.value || 0;
        }
    });

    // Copy name
    const oldNameInput = oldRow.querySelector('input[type="text"]');
    const newNameInput = newRow.querySelector('input[type="text"]');
    if (oldNameInput && newNameInput) {
        newNameInput.value = oldNameInput.value;
    }

    // Animate the new row
    newRow.style.animation = 'none';
    newRow.offsetHeight; // Trigger reflow
    newRow.style.animation = 'rowAppear 0.4s ease-out';

    calculate();
    updateStats();
}

// Delete Row
function deleteRow(id) {
    const rows = document.querySelectorAll('#tableBody tr');
    if (rows.length <= 1) return;

    const row = document.getElementById(`row-${id}`);
    if (!row) return;

    // Add fade out animation
    row.style.animation = 'fadeOut 0.3s ease-out forwards';

    setTimeout(() => {
        row.remove();
        calculate();
        updateStats();
    }, 300);
}

// Calculate Function
function calculate() {
    const rows = document.querySelectorAll('#tableBody tr');
    let grandTotalTil = 0;

    rows.forEach(row => {
        const ana = parseFloat(row.querySelector('.ana-num').value) || 0;
        const gonda = parseFloat(row.querySelector('.gonda-num').value) || 0;
        const kora = parseFloat(row.querySelector('.kora-num').value) || 0;
        const kranti = parseFloat(row.querySelector('.kranti-num').value) || 0;
        const til = parseFloat(row.querySelector('.til-num').value) || 0;

        // Calculate total tils: 1 Ana = 4800 til, 1 Gonda = 240 til, 1 Kora = 60 til, 1 Kranti = 20 til
        const totalTils = (ana * ANA_TIL) + (gonda * 240) + (kora * 60) + (kranti * 20) + til;

        // Update row total til (hidden)
        const totalTilCell = row.querySelector('.rowTotalTil');
        if (totalTilCell) {
            totalTilCell.innerText = totalTils;
        }

        // Update row share
        const shareElement = row.querySelector('.rowShare');
        if (shareElement) {
            const share = totalTils / MAX_TIL_16_ANA;
            shareElement.innerText = share.toFixed(5);
        }

        grandTotalTil += totalTils;
    });

    // Update grand total
    const totalShare = grandTotalTil / MAX_TIL_16_ANA;
    const grandTotalElement = document.getElementById('grandTotalShare');
    const totalStatusElement = document.getElementById('totalStatus');

    if (grandTotalElement) {
        grandTotalElement.innerText = totalShare.toFixed(5);
    }

    // Check if total equals 16 ana (full share)
    if (totalStatusElement) {
        const difference = Math.abs(grandTotalTil - MAX_TIL_16_ANA);
        if (difference < 1) {
            totalStatusElement.innerHTML = '<span class="success-status">১ (পূর্ণ ১৬ আনা)</span>';
            totalStatusElement.querySelector('.success-status').style.animation = 'successPulse 0.5s ease';
            // Remove error classes if present
            const table = document.querySelector('.land-table');
            if (table) table.classList.remove('shake');
            if (grandTotalElement) grandTotalElement.classList.remove('error-alert');
        } else if (grandTotalTil > MAX_TIL_16_ANA) {
            totalStatusElement.innerHTML = '<span class="error-status">মোট অংশ অতিক্রম করেছে!</span>';
            // Add shake effect to table and error alert to total
            const table = document.querySelector('.land-table');
            if (table) table.classList.add('shake');
            if (grandTotalElement) grandTotalElement.classList.add('error-alert');
        } else {
            totalStatusElement.innerHTML = '';
            // Remove error classes if present
            const table = document.querySelector('.land-table');
            if (table) table.classList.remove('shake');
            if (grandTotalElement) grandTotalElement.classList.remove('error-alert');
        }
    }

    updateStats();
}

// Copy Value to Clipboard
function copyValue(element) {
    const val = element.innerText;

    navigator.clipboard.writeText(val).then(() => {
        // Add copied class for animation
        element.classList.add('copied');

        // Store original styles
        const originalText = element.innerText;

        // Show copied feedback
        element.innerText = 'কপি হয়েছে!';

        // Reset after delay
        setTimeout(() => {
            element.classList.remove('copied');
            element.innerText = originalText;
        }, 800);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = val;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            element.classList.add('copied');
            element.innerText = 'কপি হয়েছে!';
            setTimeout(() => {
                element.classList.remove('copied');
                element.innerText = val;
            }, 800);
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
        document.body.removeChild(textArea);
    });
}

// Update Statistics
function updateStats() {
    const rows = document.querySelectorAll('#tableBody tr');
    const ownerCount = document.getElementById('ownerCount');
    const totalPercentage = document.getElementById('totalPercentage');

    if (ownerCount) {
        ownerCount.innerText = rows.length;
    }

    if (totalPercentage) {
        let grandTotalTil = 0;
        rows.forEach(row => {
            const totalTilCell = row.querySelector('.rowTotalTil');
            if (totalTilCell) {
                grandTotalTil += parseFloat(totalTilCell.innerText) || 0;
            }
        });
        const percentage = (grandTotalTil / MAX_TIL_16_ANA) * 100;
        totalPercentage.innerText = percentage.toFixed(1) + '%';
    }
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    // Ctrl + D to duplicate focused row
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        const focusedElement = document.activeElement;
        if (focusedElement && focusedElement.closest('tr')) {
            const row = focusedElement.closest('tr');
            const rowId = row.id.replace('row-', '');
            duplicateRow(parseInt(rowId));
        }
    }
});

// Initialize on page load
window.addEventListener('load', () => {
    init();
});

// Re-initialize on page visibility change (for mobile browsers)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        calculate();
        updateStats();
    }
});