export class ChallengeCard {
    constructor(challenge, template, container, type) {
        this.challenge = challenge;
        this.card = template.content.cloneNode(true).children[0];
        this.container = container;
        this.type = type;

        this.renderBase();
        this.renderByType();
    }

    renderBase() {
        const challengeExercises = this.card.querySelector("[challenge-exercises]");
        const challengeTitle = this.card.querySelector("[challenge-title]");
    
        // Handle exercises: array or string fallback
        if (challengeExercises) {
            challengeExercises.textContent = Array.isArray(this.challenge.exercises)
                ? this.challenge.exercises.join(", ")
                : this.challenge.exercises || "None";
        }
    
        if (challengeTitle) {
            challengeTitle.textContent = this.challenge.title || "Untitled Challenge";
        }
        
    
    }
    
    renderByType() {
        switch (this.type) {
            case "not started":
                this.notStartedCard();
                break;
            case "in progress":
                this.inProgressCard();
                break;
            case "finished":
                this.finishedCard();
                break;
            default:
                console.warn("Unexpected type:", this.type);
        }
    }
    
    getElement() {
        return this.card;
    }
    
    notStartedCard() {
        const startDate = this.card.querySelector("[challenge-start]");
        const invitedUsers = this.card.querySelector("[challenge-invited-users]");
    
        if (startDate) startDate.textContent = this.challenge.start_date;
        if (duration) duration.textContent = `${this.challenge.duration_days} days`;
    
        if (invitedUsers) {
            if(Array.isArray(this.challenge.invited_users)){
                const userNames = this.challenge.invited_users.map(user =>{
                    return user.name;
                });
                users.textContent = userNames.join(", ");
            }
            else{
                users.textContent = ("N/A");
            }
                
        }
    }
    
    inProgressCard() {
        const daysLeft = this.card.querySelector("[challenge-days-left]");
        const users = this.card.querySelector("[challenge-users]");
        const points = this.card.querySelector("[challenge-points]");
    
        if (daysLeft) daysLeft.textContent = `${this.challenge.days_left} days remaining`;
    
        if (users) {
            if(Array.isArray(this.challenge.users)){
                const userNames = this.challenge.users.map( user => {
                    return user.name;
                });

                // Join all the names with commas
                users.textContent = userNames.join(", ");
                } 
            else {
                users.textContent = "N/A";
            }
        }
    
        if (points) points.textContent = `${this.challenge.total_points || 0} pts`;
    }
    
    finishedCard() {
        const users = this.card.querySelector("[challenge-users]");
        const points = this.card.querySelector("[challenge-points]");
        const winner = this.card.querySelector("[challenge-winner]");
    
          // Show the list of users
        if (users) {
            if (Array.isArray(this.challenge.users)) {
            // For each user, combine their first and last name
            const userNames = this.challenge.users.map(user => {
                return user.name;
            })

            // Join all the names with commas
            users.textContent = userNames.join(", ");
            } else {
            users.textContent = "N/A";
            }
        }

        // Show total points (or 0 if not set)
        if (points) {
            points.textContent = (this.challenge.total_points || 0) + " pts";
        }

        if (winner) {
            if (this.challenge.winner && typeof this.challenge.winner === "object") {
              // Access the name from the winner object
              winner.textContent = `🏆 ${this.challenge.winner.name || "Unknown"}`;
            } 
            else {
              winner.textContent = "🏆 N/A";
            }
          }
    }
}