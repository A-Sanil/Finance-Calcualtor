// --- Custom Budget Planner Logic ---
let customBudgetChart;
const defaultCategories = [
    'housing', 'transportation', 'food', 'utilities', 'savings', 'healthcare', 'entertainment', 'miscellaneous'
];
const defaultColors = [
    '#38ef7d', '#667eea', '#f093fb', '#11998e', '#764ba2', '#f5576c', '#ffc107', '#28a745'
];
function renderCustomBudgetInputs() {
    const container = document.getElementById('customBudgetInputs');
    container.innerHTML = '';
    const total = 100;
    const income = parseFloat(document.getElementById('income') ? document.getElementById('income').value : 0) || 0;
    defaultCategories.forEach((cat, idx) => {
        const label = cat.charAt(0).toUpperCase() + cat.slice(1);
        const percent = 12.5;
        const money = income > 0 ? ((percent/100)*income).toLocaleString(undefined, {maximumFractionDigits:2}) : '';
        container.innerHTML += `
            <div style="margin-bottom:15px;">
                <label for="custom_${cat}">${label} <span id="customVal_${cat}">${percent}</span>% <span id="customMoney_${cat}" style="color:#888;font-size:0.95em;">${money ? '($'+money+')' : ''}</span></label>
                <input type="range" min="0" max="100" value="12.5" step="0.5" id="custom_${cat}" oninput="updateCustomVal('${cat}')" style="width:70%"> 
            </div>
        `;
    });
    updateCustomBudgetPercent();
}
function updateCustomVal(cat) {
    const val = document.getElementById('custom_' + cat).value;
    document.getElementById('customVal_' + cat).textContent = val;
    // Update money value if income is set
    const income = parseFloat(document.getElementById('income') ? document.getElementById('income').value : 0) || 0;
    const money = income > 0 ? ((val/100)*income).toLocaleString(undefined, {maximumFractionDigits:2}) : '';
    document.getElementById('customMoney_' + cat).textContent = money ? `($${money})` : '';
    updateCustomBudgetPercent();
    drawCustomBudgetChart();
}
function updateCustomBudgetPercent() {
    let sum = 0;
    defaultCategories.forEach(cat => {
        sum += parseFloat(document.getElementById('custom_' + cat).value);
    });
    const left = Math.max(0, 100 - sum).toFixed(2);
    document.getElementById('customBudgetPercent').textContent = `Total: ${sum.toFixed(2)}% used, ${left}% left`;
}
function getCustomBudgetData() {
    let values = [];
    let sum = 0;
    defaultCategories.forEach(cat => {
        const v = parseFloat(document.getElementById('custom_' + cat).value);
        values.push(v);
        sum += v;
    });
    // Normalize if sum > 100
    if (sum > 100) values = values.map(v => v * 100 / sum);
    return values;
}
function drawCustomBudgetChart() {
    const ctx = document.getElementById('customBudgetChart').getContext('2d');
    if (customBudgetChart) customBudgetChart.destroy();
    const values = getCustomBudgetData();
    const income = parseFloat(document.getElementById('income') ? document.getElementById('income').value : 0) || 0;
    customBudgetChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: defaultCategories.map((c, i) => {
                let label = c.charAt(0).toUpperCase() + c.slice(1);
                let percent = values[i].toFixed(2);
                let money = income > 0 ? ` ($${((values[i]/100)*income).toLocaleString(undefined, {maximumFractionDigits:2})})` : '';
                return `${label}: ${percent}%${money}`;
            }),
            datasets: [{
                data: values,
                backgroundColor: defaultColors,
                borderWidth: 2
            }]
        },
        options: {
            plugins: { legend: { position: 'bottom' } }
        }
    });
}
function applyCustomBudget() {
    const values = getCustomBudgetData();
    let sum = values.reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 100) > 1) {
        alert('Total must be close to 100%. Please adjust your sliders.');
        return;
    }
    alert('Custom budget applied! (You can add logic to save or use this data.)');
}
// Helper: Show/hide elements
function showElement(id) { document.getElementById(id).classList.remove('hidden'); }
function hideElement(id) { document.getElementById(id).classList.add('hidden'); }
// Show tab logic
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
    const tabBtns = document.querySelectorAll('.nav-tab');
    const tabNames = ['dashboard','calculator','customBudget','expenses','goals','scenarios','profiles','reports','settings'];
    tabNames.forEach((name, idx) => {
        if (name === tabId) tabBtns[idx].classList.add('active');
    });
    // Special: If Custom Budget tab, render inputs/chart
    if (tabId === 'customBudget') {
        renderCustomBudgetInputs();
        drawCustomBudgetChart();
    }
}
// Unified initialization
window.addEventListener('DOMContentLoaded', function() {
    showElement('navTabs');
    showElement('appContent');
    // Initial load for dashboard tab
    showTab('dashboard');
    // Load expenses and goals
    if (typeof loadExpenses === 'function') loadExpenses();
    if (typeof loadGoals === 'function') loadGoals();
});
