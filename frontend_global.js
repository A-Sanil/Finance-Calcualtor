// --- Multi-Profile Logic ---
async function loadProfiles() {
    try {
        const response = await fetch('/api/user-profile');
        if (!response.ok) throw new Error('Failed to load profiles.');
        const data = await response.json();
        const container = document.getElementById('profilesContainer');
        container.innerHTML = '';
        if (!data.profiles || data.profiles.length === 0) {
            container.innerHTML = '<div style="color:#888">No profiles found. Create one!</div>';
            return;
        }
        data.profiles.forEach(profile => {
            const div = document.createElement('div');
            div.className = 'profile-card' + (profile.is_active ? ' active' : '');
            div.innerHTML = `
                <b>${profile.profile_name}</b> ${profile.is_active ? '<span style="color:#38ef7d">(Active)</span>' : ''}<br>
                <span style="font-size:0.95em;color:#888">${profile.created_at ? profile.created_at.split('T')[0] : ''}</span><br>
                <button class="btn btn-small btn-success" onclick="activateProfile(${profile.id})">Select</button>
                <button class="btn btn-small btn-secondary" onclick="downloadSingleProfile(${profile.id})">Download</button>
                <button class="btn btn-small btn-warning" onclick="deleteProfile(${profile.id})">Delete</button>
            `;
            container.appendChild(div);
        });
    } catch (err) {
        document.getElementById('profilesContainer').innerHTML = '<div class="error">Could not load profiles.</div>';
    }
}

async function createNewProfile() {
    const name = prompt('Enter a name for your new profile:');
    if (!name) return;
    // Optionally, collect more data here or use defaults
    try {
        const response = await fetch('/api/user-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile_name: name })
        });
        if (!response.ok) throw new Error('Failed to create profile.');
        await loadProfiles();
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

async function activateProfile(profileId) {
    try {
        const response = await fetch('/api/user-profile/activate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile_id: profileId })
        });
        if (!response.ok) throw new Error('Failed to activate profile.');
        await loadProfiles();
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

async function deleteProfile(profileId) {
    if (!confirm('Delete this profile? This cannot be undone.')) return;
    try {
        const response = await fetch(`/api/user-profile/${profileId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete profile.');
        await loadProfiles();
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

// Download a single profile (by id)
async function downloadSingleProfile(profileId) {
    try {
        const response = await fetch('/api/user-profile/export');
        if (!response.ok) throw new Error('Failed to download profile.');
        const allProfiles = await response.json();
        const profile = allProfiles.find(p => p.id === profileId);
        if (!profile) throw new Error('Profile not found.');
        const blob = new Blob([JSON.stringify([profile], null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${profile.profile_name || 'profile'}.json`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            a.remove();
        }, 100);
    } catch (err) {
        alert('Error: ' + err.message);
    }
}
// --- Profile Export/Import Logic ---
async function downloadProfile() {
    try {
        const response = await fetch('/api/user-profile/export');
        if (!response.ok) throw new Error('Failed to download profile.');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'user_profiles.json';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            a.remove();
        }, 100);
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

async function uploadProfile(event) {
    const fileInput = event.target;
    if (!fileInput.files || !fileInput.files[0]) return;
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    try {
        const response = await fetch('/api/user-profile/import', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to upload profile.');
        alert('Profile uploaded and restored!');
        loadProfiles();
    } catch (err) {
        alert('Error: ' + err.message);
    } finally {
        fileInput.value = '';
    }
}
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
