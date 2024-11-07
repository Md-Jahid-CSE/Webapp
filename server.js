async function addTeam() {
    const teamLeader = document.getElementById("teamLeader").value.trim();
    const groupNumber = document.getElementById("groupNumber").value.trim();
    const presentationTitle = document.getElementById("presentationTitle").value.trim();
    const errorMessage = document.getElementById("errorMessage");

    errorMessage.textContent = '';

    if (!teamLeader || !groupNumber || !presentationTitle) {
        errorMessage.textContent = "All fields are required.";
        return;
    }

    console.log("Attempting to add team:", { teamLeader, groupNumber, presentationTitle });

    try {
        const response = await fetch('http://localhost:3000/teams', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leader: teamLeader, group: groupNumber, presentation: presentationTitle })
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            const error = await response.json();
            errorMessage.textContent = error.error;
            return;
        }

        console.log("Team added successfully!");
        await loadTeams();
        document.getElementById("teamForm").reset();
    } catch (error) {
        console.error("Error:", error);
        errorMessage.textContent = "Failed to add team. Please try again later.";
    }
}
