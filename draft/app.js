// Draft Pick App JS


// --- Team Management State ---
let teams = [];
let editIndex = null;

// --- DOM Elements ---
const teamListEl = document.getElementById('team-list');
const addTeamForm = document.getElementById('add-team-form');
const teamNameInput = document.getElementById('team-name-input');
const startDraftBtn = document.getElementById('start-draft-btn');
const teamWarning = document.getElementById('team-warning');

// --- Render Team List ---
function renderTeams() {
    teamListEl.innerHTML = '';
    teams.forEach((team, idx) => {
        const li = document.createElement('li');
        if (editIndex === idx) {
            // Edit mode
            const input = document.createElement('input');
            input.type = 'text';
            input.value = team;
            input.className = 'edit-team-input';
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') saveEdit(idx, input.value);
                if (e.key === 'Escape') cancelEdit();
            });
            li.appendChild(input);
            const saveBtn = document.createElement('button');
            saveBtn.textContent = 'Save';
            saveBtn.onclick = () => saveEdit(idx, input.value);
            li.appendChild(saveBtn);
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancel';
            cancelBtn.onclick = cancelEdit;
            li.appendChild(cancelBtn);
        } else {
            // Normal mode
            const span = document.createElement('span');
            span.textContent = team;
            li.appendChild(span);
            const actions = document.createElement('span');
            actions.className = 'team-actions';
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.onclick = () => startEdit(idx);
            actions.appendChild(editBtn);
            const delBtn = document.createElement('button');
            delBtn.textContent = 'Delete';
            delBtn.onclick = () => deleteTeam(idx);
            actions.appendChild(delBtn);
            li.appendChild(actions);
        }
        teamListEl.appendChild(li);
    });
    updateDraftControls();
}

// --- Add Team ---
addTeamForm.onsubmit = (e) => {
    e.preventDefault();
    const name = teamNameInput.value.trim();
    if (!name) return;
    teams.push(name);
    teamNameInput.value = '';
    editIndex = null;
    renderTeams();
};

// --- Edit Team ---
function startEdit(idx) {
    editIndex = idx;
    renderTeams();
    // Focus input
    setTimeout(() => {
        const input = document.querySelector('.edit-team-input');
        if (input) input.focus();
    }, 0);
}
function saveEdit(idx, newName) {
    newName = newName.trim();
    if (!newName) return;
    teams[idx] = newName;
    editIndex = null;
    renderTeams();
}
function cancelEdit() {
    editIndex = null;
    renderTeams();
}

// --- Delete Team ---
function deleteTeam(idx) {
    teams.splice(idx, 1);
    editIndex = null;
    renderTeams();
}

// --- Draft Controls ---
function updateDraftControls() {
    if (teams.length < 2) {
        startDraftBtn.disabled = true;
        teamWarning.style.display = 'block';
    } else {
        startDraftBtn.disabled = false;
        teamWarning.style.display = 'none';
    }
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    renderTeams();
});
