import { WorkoutCard } from './workoutcard.js';
export class UserCard{
    constructor(user, template, mode, workoutTemplate){
    this.user = user;
    this.card = template.content.cloneNode(true).children[0];
    this.mode = mode;
    this.workoutTemplate = workoutTemplate;

    this.renderBase();
    this.renderByMode();
}
//each UserCard will have this
renderBase() {
    //create profile pic
    const imageContainer = this.card.querySelector("[image-tag]");
    const img = document.createElement("img");
  
    const profile_pic = this.user.image_file;
    img.src = profile_pic;
    img.alt = "profile_image";
    img.style.width = "50px";
    img.style.height = "50px";
    img.style.objectFit = "cover";
    img.classList.add("rounded-circle");
  
    imageContainer.appendChild(img);
  
    //show full name
    const name = this.card.querySelector("[name-tag]");
    const fullName = `${this.user.first_name} ${this.user.last_name}`;
    name.textContent = fullName;
  
    //button to view user's profile
    const view_profile = this.card.querySelector("[view-profile-tag]");
    if (view_profile) {
      view_profile.textContent = "View Profile";
      view_profile.addEventListener("click", () => {
        window.location.href = `/view_other_user/${this.user.id}`;
      });
    }
}
renderByMode(){
    switch(this.mode){
        case "feed":
            this.renderWorkout();
            break;
        case "friend_requests":
            this.requestResponse();
            break;
        case "search_users":
            this.setupFriendButton();
            break;
        case "friends":
            this.setupFriendButton();
            break;
    }
}
setupFriendButton() {
    const friend_button = this.card.querySelector("[friend-tag]");
    if (!friend_button)
        return;
    // Set button text based on friend_status
    const status = this.user.friend_status;
    if (status === "accepted") {
      friend_button.textContent = "Remove Friend";
    } else if (status === "pending") {
      friend_button.textContent = "Pending";
    } else {
      friend_button.textContent = "Add Friend";
    }
  
    friend_button.dataset.userId = this.user.id;
    friend_button.dataset.status = status;
  
    // Friend button behavior
    friend_button.addEventListener("click", () => {
      const userId = friend_button.dataset.userId;
      const status = friend_button.dataset.status;
  
      let endpoint = "";
      if (status === "accepted") {
        endpoint = `/remove_friend/${userId}`;
      } else if (status === "pending") {
        endpoint = `/cancel_friend_request/${userId}`;
      } else {
        endpoint = `/send_friend_request/${userId}`;
      }
  
      fetch(endpoint, { method: "POST" })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            friend_button.textContent = data.new_label;
            friend_button.dataset.status = data.new_status;
          }
        });
    });
  }
  requestResponse() {
    const accept_button = this.card.querySelector("[accept-tag]");
    const reject_button = this.card.querySelector("[reject-tag]");
  
    if (!accept_button || !reject_button) return;
  
    accept_button.textContent = "Accept";
    reject_button.textContent = "Reject";
  
    accept_button.dataset.userId = this.user.id;
    accept_button.dataset.status = this.user.friend_status;
  
    reject_button.dataset.userId = this.user.id;
    reject_button.dataset.status = this.user.friend_status;
  
    // Accept button handler
    accept_button.addEventListener("click", () => {
      const userId = accept_button.dataset.userId;
  
      fetch(`/accept_friend/${userId}`, { method: "POST" })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            accept_button.textContent = data.new_label;
            accept_button.disabled = true;
            reject_button.disabled = true;
            reject_button.style.display = "none";
          }
        });
    });
  
    // Reject button handler
    reject_button.addEventListener("click", () => {
      const userId = reject_button.dataset.userId;
  
      fetch(`/reject_friend/${userId}`, { method: "POST" })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            reject_button.textContent = data.new_label;
            accept_button.disabled = true;
            reject_button.disabled = true;
            accept_button.style.display = "none";
            this.card.style.display = "none"; // hide the whole card
          }
        });
    });
  }
  renderWorkout(){
        if (!this.user.workouts || this.user.workouts.length === 0) return; // ⬅ skip this user
      
    //this.card accesses the workout card, which can then access the html document querySelector workout-stats-container
    const workoutContainer = this.card.querySelector("[workout-stats-container]")
  
    this.user.workouts.forEach(workout => {
      const workoutDetails = new WorkoutCard(
        workout, 
        this.workoutTemplate, 
        this.mode,
        this.card.querySelector("[workout-stats-container]")
      );
      workoutContainer.appendChild(workoutDetails.getElement());
      this.card.style.display = "block";
    });
  }
  getElement() {
    return this.card;
  }
  getFullName() {
  return `${this.user.first_name} ${this.user.last_name}`;
}
}