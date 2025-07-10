document.addEventListener('DOMContentLoaded', () => {
    const playerInputs = document.getElementById('player-inputs');
    const addPlayerBtn = document.getElementById('add-player');
    const generateBtn = document.getElementById('generate-schedule');
    const scheduleResults = document.getElementById('schedule-results');
    const matchesContainer = document.getElementById('matches');

    // Add new player input field
    addPlayerBtn.addEventListener('click', () => {
        const currentInputs = document.querySelectorAll('.player-name');
        if (currentInputs.length < 10) {
            const newInput = document.createElement('div');
            newInput.className = 'player-input';
            newInput.innerHTML = '<input type="text" placeholder="Enter player name" class="player-name">';
            playerInputs.appendChild(newInput);
        } else {
            alert('Maximum of 10 players allowed');
        }
    });

    // Generate tournament schedule
    generateBtn.addEventListener('click', () => {
        const players = Array.from(document.querySelectorAll('.player-name'))
            .map(input => input.value.trim())
            .filter(name => name !== '');

        if (players.length < 2) {
            alert('Please enter at least 2 players');
            return;
        }

        // Generate all possible unique match combinations
        const matches = [];
        for (let i = 0; i < players.length; i++) {
            for (let j = i + 1; j < players.length; j++) {
                matches.push({
                    player1: players[i],
                    player2: players[j],
                    score1: '',
                    score2: '',
                    completed: false
                });
            }
        }

        // Display the schedule
        matchesContainer.innerHTML = '';
        matches.forEach((match, index) => {
            const matchElement = document.createElement('div');
            matchElement.className = 'match';
            matchElement.innerHTML = `
                <div class="match-header">
                    <strong>Match ${index + 1}:</strong> ${match.player1} vs ${match.player2}
                </div>
                <div class="score-input">
                    <input type="number" min="0" max="21" placeholder="Score" class="score1" data-match="${index}">
                    <span> - </span>
                    <input type="number" min="0" max="21" placeholder="Score" class="score2" data-match="${index}">
                    <button class="save-score" data-match="${index}">Save Score</button>
                </div>
                <div class="match-status" data-match="${index}"></div>
            `;
            matchesContainer.appendChild(matchElement);
        });

        // Add event listeners for score saving
        document.querySelectorAll('.save-score').forEach(button => {
            button.addEventListener('click', (e) => {
                const matchIndex = e.target.dataset.match;
                const score1 = document.querySelector(`.score1[data-match="${matchIndex}"]`).value;
                const score2 = document.querySelector(`.score2[data-match="${matchIndex}"]`).value;
                
                if (!score1 || !score2) {
                    alert('Please enter both scores');
                    return;
                }

                const score1Num = parseInt(score1);
                const score2Num = parseInt(score2);

                if (score1Num < 0 || score1Num > 21 || score2Num < 0 || score2Num > 21) {
                    alert('Scores must be between 0 and 21');
                    return;
                }

                // Update match status
                const statusElement = document.querySelector(`.match-status[data-match="${matchIndex}"]`);
                const player1 = matches[matchIndex].player1;
                const player2 = matches[matchIndex].player2;
                
                let winner = '';
                if (score1Num > score2Num) {
                    winner = player1;
                } else if (score2Num > score1Num) {
                    winner = player2;
                } else {
                    alert('Scores cannot be equal in pickleball');
                    return;
                }

                statusElement.innerHTML = `
                    <div class="result">
                        <strong>Result:</strong> ${winner} won ${Math.max(score1Num, score2Num)}-${Math.min(score1Num, score2Num)}
                    </div>
                `;

                // Update the match object
                matches[matchIndex].score1 = score1Num;
                matches[matchIndex].score2 = score2Num;
                matches[matchIndex].completed = true;
            });
        });

        scheduleResults.classList.remove('hidden');
    });
}); 