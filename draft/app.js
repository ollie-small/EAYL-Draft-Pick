// --- Render Draft Results ---
function renderDraftResults() {
    const section = document.getElementById('draft-results-section');
    const resultsDiv = document.getElementById('draft-results');
    if (!draftResults) {
        section.style.display = 'none';
        resultsDiv.innerHTML = '';
        return;
    }
    // Hide other sections
    document.getElementById('team-management').style.display = 'none';
    document.getElementById('people-management').style.display = 'none';
    document.getElementById('draft-controls').style.display = 'none';
    section.style.display = 'block';
    let html = '';
    for (const [team, members] of Object.entries(draftResults)) {
        html += `<h3>${team}</h3>`;
        if (members.length === 0) {
            html += '<p><em>No participants assigned.</em></p>';
        } else {
            html += '<ul>' + members.map(m => `<li>${m}</li>`).join('') + '</ul>';
        }
    }
    resultsDiv.innerHTML = html;
    // Attach restart handler (button is now visible)
    const restartBtn = document.getElementById('restart-draft-btn');
    if (restartBtn) {
        restartBtn.onclick = restartDraft;
    }
// --- Restart Draft Logic ---
function restartDraft() {
    // Reset state
    teams = [];
    people = [];
    draftResults = null;
    editIndex = null;
    personEditIndex = null;
    // Show setup sections, hide results
    document.getElementById('team-management').style.display = '';
    document.getElementById('people-management').style.display = '';
    document.getElementById('draft-controls').style.display = '';
    document.getElementById('draft-results-section').style.display = 'none';
    // Re-render lists and controls
    renderTeams();
    renderPeople();
    updateDraftControls();
}

// (No longer needed: restart handler is attached in renderDraftResults)
}
// --- Draft Logic ---
function runDraftAssignment() {
    // Clone and shuffle participants
    const shuffled = [...people];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Prepare results object
    const results = {};
    teams.forEach(team => results[team] = []);
    // Fair distribution: calculate base and remainder
    const numTeams = teams.length;
    const numPeople = shuffled.length;
    const base = Math.floor(numPeople / numTeams);
    const remainder = numPeople % numTeams;
    // Randomly select which teams get the extra participant
    let teamOrder = [...teams];
    for (let i = teamOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [teamOrder[i], teamOrder[j]] = [teamOrder[j], teamOrder[i]];
    }
    let idx = 0;
    for (let t = 0; t < numTeams; t++) {
        const team = teamOrder[t];
        const count = base + (t < remainder ? 1 : 0);
        for (let c = 0; c < count; c++) {
            if (idx < shuffled.length) {
                results[team].push(shuffled[idx]);
                idx++;
            }
        }
    }
    draftResults = results;
}
// Draft Pick App JS


// --- Team Management State ---
let teams = [];
let editIndex = null;

// --- Draft Assignment State ---
let draftResults = null; // { teamName: [participant, ...], ... }

// --- People Management State ---
let people = [];
let personEditIndex = null;

// --- DOM Elements ---
const teamListEl = document.getElementById('team-list');
const addTeamForm = document.getElementById('add-team-form');
const teamNameInput = document.getElementById('team-name-input');
const startDraftBtn = document.getElementById('start-draft-btn');
const draftWarning = document.getElementById('draft-warning');

// People DOM
const personListEl = document.getElementById('person-list');
const addPersonForm = document.getElementById('add-person-form');
const personNameInput = document.getElementById('person-name-input');

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

// --- Render People List ---
function renderPeople() {
    personListEl.innerHTML = '';
    people.forEach((person, idx) => {
        const li = document.createElement('li');
        if (personEditIndex === idx) {
            // Edit mode
            const input = document.createElement('input');
            input.type = 'text';
            input.value = person;
            input.className = 'edit-person-input';
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') savePersonEdit(idx, input.value);
                if (e.key === 'Escape') cancelPersonEdit();
            });
            li.appendChild(input);
            const saveBtn = document.createElement('button');
            saveBtn.textContent = 'Save';
            saveBtn.onclick = () => savePersonEdit(idx, input.value);
            li.appendChild(saveBtn);
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancel';
            cancelBtn.onclick = cancelPersonEdit;
            li.appendChild(cancelBtn);
        } else {
            // Normal mode
            const span = document.createElement('span');
            span.textContent = person;
            li.appendChild(span);
            const actions = document.createElement('span');
            actions.className = 'team-actions';
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.onclick = () => startPersonEdit(idx);
            actions.appendChild(editBtn);
            const delBtn = document.createElement('button');
            delBtn.textContent = 'Delete';
            delBtn.onclick = () => deletePerson(idx);
            actions.appendChild(delBtn);
            li.appendChild(actions);
        }
        personListEl.appendChild(li);
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

// --- Add Person ---
addPersonForm.onsubmit = (e) => {
    e.preventDefault();
    const name = personNameInput.value.trim();
    if (!name) return;
    people.push(name);
    personNameInput.value = '';
    personEditIndex = null;
    renderPeople();
};

// --- Edit Team ---
function startEdit(idx) {
    editIndex = idx;
    renderTeams();
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

// --- Edit Person ---
function startPersonEdit(idx) {
    personEditIndex = idx;
    renderPeople();
    setTimeout(() => {
        const input = document.querySelector('.edit-person-input');
        if (input) input.focus();
    }, 0);
}
function savePersonEdit(idx, newName) {
    newName = newName.trim();
    if (!newName) return;
    people[idx] = newName;
    personEditIndex = null;
    renderPeople();
}
function cancelPersonEdit() {
    personEditIndex = null;
    renderPeople();
}

// --- Delete Team ---
function deleteTeam(idx) {
    teams.splice(idx, 1);
    editIndex = null;
    renderTeams();
}

// --- Delete Person ---
function deletePerson(idx) {
    people.splice(idx, 1);
    personEditIndex = null;
    renderPeople();
}

// --- Draft Controls ---
function updateDraftControls() {
    let warning = '';
    if (teams.length < 2 && people.length < 2) {
        warning = 'At least 2 teams and 2 participants are needed to start draft.';
    } else if (teams.length < 2) {
        warning = 'At least 2 teams are needed to start draft.';
    } else if (people.length < 2) {
        warning = 'At least 2 participants are needed to start draft.';
    }
    if (warning) {
        draftWarning.textContent = warning;
        draftWarning.style.display = 'block';
        startDraftBtn.disabled = true;
    } else {
        draftWarning.textContent = '';
        draftWarning.style.display = 'none';
        startDraftBtn.disabled = false;
    }
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    renderTeams();
    renderPeople();
});
    
    // --- Start Draft Handler ---
    startDraftBtn.onclick = function() {
        // Double-check validation before proceeding
        if (teams.length < 2 && people.length < 2) {
            draftWarning.textContent = 'At least 2 teams and 2 participants are needed to start draft.';
            draftWarning.style.display = 'block';
            return;
        } else if (teams.length < 2) {
            draftWarning.textContent = 'At least 2 teams are needed to start draft.';
            draftWarning.style.display = 'block';
            return;
        } else if (people.length < 2) {
            draftWarning.textContent = 'At least 2 participants are needed to start draft.';
            draftWarning.style.display = 'block';
            return;
        }
    // Run draft assignment
    runDraftAssignment();
    renderDraftResults();
    };
