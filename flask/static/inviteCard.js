export class InviteCard {
    constructor(challenge, template, container) {
        this.challenge = challenge;
        this.card = template.content.cloneNode(true).children[0];
        this.container = container;

        this.renderCard();
    }

    renderCard() {
        const title = this.card.querySelector("[challenge-title]");
        const exercises = this.card.querySelector("[challenge-exercises]");
        const invitedUsers = this.card.querySelector("[invited-users]");
        const acceptButton = this.card.querySelector("[accept-button]");
        const rejectButton = this.card.querySelector("[reject-button]");

        if (title) title.textContent = this.challenge.title;

        if (exercises)
            exercises.textContent = Array.isArray(this.challenge.exercises)
                ? this.challenge.exercises.join(", ")
                : this.challenge.exercises;

        if (invitedUsers)
            invitedUsers.textContent = Array.isArray(this.challenge.invited_users)
                ? this.challenge.invited_users.join(", ")
                : this.challenge.invited_users || "None";
    
        acceptButton.dataset.challengeId = this.challenge.challenge_id;
        rejectButton.dataset.challengeId = this.challenge.challenge_id;
    
        // Accept
        if (acceptButton) {
            console.log("Accept button found, adding click event listener.");
            acceptButton.addEventListener("click", () => {
                const challengeId = acceptButton.dataset.challengeId;
                console.log(`Accept button clicked. Challenge ID: ${challengeId}`);
    
                fetch(`/accept_invite/${challengeId}`, { method: "POST" })
                    .then(response => {
                        console.log("Received response from /accept_invite.");
                        return response.json();
                    })
                    .then(data => {
                        console.log("Parsed JSON data from accept response:", data);
                        acceptButton.disabled = true;
                        rejectButton.disabled = true;
                        acceptButton.style.display = "none";
                        rejectButton.style.display = "none";
    
                        const responseMessage = document.createElement("div");
                        responseMessage.classList.add("message");
                        responseMessage.innerHTML = `
                            <div class="message-content">
                                <p>You have accepted the challenge.</p>
                            </div>
                        `;
                        this.card.innerHTML = `
                        <div class="response-message accepted">
                             ${data.message}
                        </div>
                    `;
                    this.card.style.display = "none";
                    })
                    .catch(error => {
                        console.error("Error during accept request:", error);
                    });
            });
        } else {
            console.warn("Accept button not found.");
        }
    
        // Reject
        if (rejectButton) {
            console.log("Reject button found, adding click event listener.");
            rejectButton.addEventListener("click", () => {
                const challengeId = rejectButton.dataset.challengeId;
                console.log(`Reject button clicked. Challenge ID: ${challengeId}`);
    
                fetch(`/reject_invite/${challengeId}`, { method: "POST" })
                    .then(response => {
                        console.log("Received response from /reject_invite.");
                        return response.json();
                    })
                    .then(data => {
                        console.log("Parsed JSON data from reject response:", data);
                        acceptButton.disabled = true;
                        rejectButton.disabled = true;
                        acceptButton.style.display = "none";
                        rejectButton.style.display = "none";
    
                        const responseMessage = document.createElement("div");
                        responseMessage.classList.add("message");
                        responseMessage.innerHTML = `
                            <div class="message-content">
                                <p>You have rejected the challenge.</p>
                            </div>
                        `;
                        this.card.innerHTML = `
                            <div class="response-message rejected">
                                ${data.message}
                            </div>
                        `;
                        console.log("Reject response message appended to card.");
                        this.card.style.display = "none";
                    })
                    .catch(error => {
                        console.error("Error during reject request:", error);
                    });
            });
        } else {
            console.warn("Reject button not found.");
        }
    }

getElement() {
    return this.card;
}
}