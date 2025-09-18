# EAYL-Draft-Pick

## Overview
EAYL-Draft-Pick is a single-page web application for creating teams and randomly distributing participants among those teams through an automated, fair draft process. The app is self-contained, requires no external dependencies, and works entirely in the browser.

## Features
- **Team Management:** Add, edit, and delete teams with custom names (minimum 2 teams required).
- **People Management:** Add, edit, and delete participants (minimum 2 required).
- **Automated Draft:** Random, round-based assignment of participants to teams, ensuring no one is left unassigned.
- **Fair Distribution:** Evenly distributes participants across teams, handling remainders (e.g., 23 people, 5 teams = 5,5,5,4,4).
- **Results Phase:** Displays final team rosters and allows restarting the draft.
- **Responsive UI:** Works on desktop and mobile, with clear feedback and validation.
- **No External Dependencies:** 100% vanilla JS, HTML, and CSS. No frameworks or libraries required.

## Getting Started
1. **Clone or Download** this repository.
2. Open `draft/index.html` in your web browser (no build or server required).
3. Start by adding teams and participants, then run the draft!

## File Structure
```
draft/
├── index.html   # Main application file
├── style.css    # App styles
├── app.js       # App logic
├── spec.md      # Specification document
└── README.md    # This file
tasks/
├── 00-setup.md
├── 01-team-management.md
├── 02-people-management.md
├── 03-validate-setup.md
├── 04-automated-draft-process.md
├── 05-fair-distribution.md
├── 06-results-phase.md
└── 07-responsive-ui.md
```

## Usage
1. **Add Teams:** Enter team names and add at least 2 teams.
2. **Add Participants:** Enter participant names and add at least 2 people.
3. **Start Draft:** Click the draft button to randomly assign participants to teams.
4. **Reveal Results:** View the suspenseful reveal and final team rosters. Optionally restart for a new draft.

## Technical Details
- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Storage:** In-memory (session only)
- **Works Offline:** After initial load
- **Browser Support:** Chrome, Firefox, Safari, Edge

## Development Tasks
See the `tasks/` directory for detailed implementation steps and acceptance criteria for each feature.

## License
MIT License