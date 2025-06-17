document.addEventListener("DOMContentLoaded", () => {
    // ---------- ADD WORKOUT PAGE ----------
    const exerciseOption = document.getElementById("exercise");
    if (exerciseOption) {
      exerciseOption.addEventListener("change", (event) => {
        const selectedWorkout = event.target.value;
        console.log("Selected workout:", selectedWorkout);
      });
    }
  
    // ---------- FEED PAGE ----------
    const feedTemplate = document.querySelector("[data-feed-template]");
    const feedContainer = document.getElementById("feedContainer");
    if (feedTemplate && feedContainer) {
      fetch("/api_feed")
        .then(response => response.json())
        .then(data => {
          const users = data.users;
  
          users.forEach(user => {
            user.workouts.forEach(workout => {
              const card = userCardTemplate.content.cloneNode(true).children[0];
              const imageContainer = card.querySelector("[image-tag]");
              const img = document.createElement("img");
              const profile_pic = user.image_file;
              const fullName = `${user.first_name} ${user.last_name}`;
  
              img.src = profile_pic;
              img.alt = fullName;
              img.style.width = "50px";
              img.style.height = "50px";
              img.style.objectFit = "cover";
              img.classList.add("rounded-circle");
              imageContainer.appendChild(img);
  
              const nameContainer = card.querySelector("[name-tag]");
              if (nameContainer) {
                const nameElement = document.createElement("p");
                nameElement.textContent = fullName;
                nameContainer.appendChild(nameElement);
              }
  
              card.querySelector("[exercise-data]").textContent = workout.exercise;
              card.querySelector("[title-data]").textContent = workout.workout_title;
  
              const date = new Date(workout.date);
              card.querySelector("[datetime-data]").textContent = date.toLocaleString();
  
              const totalSeconds = Math.round(workout.duration_minutes * 60);
              const h = Math.floor(totalSeconds / 3600);
              const m = Math.floor((totalSeconds % 3600) / 60);
              const s = totalSeconds % 60;
  
              const hours = card.querySelector("[hours-data]");
              const minutes = card.querySelector("[minutes-data]");
              const seconds = card.querySelector("[seconds-data]");
  
              h > 0 ? hours.innerHTML = `<span class="number">${h}</span><span class="unit"> hr</span>` : hours.style.display = "none";
              m > 0 ? minutes.innerHTML = `<span class="number">${m}</span><span class="unit"> min</span>` : minutes.style.display = "none";
              s > 0 ? seconds.innerHTML = `<span class="number">${s}</span><span class="unit"> sec</span>` : seconds.style.display = "none";
  
              userCardContainer.appendChild(card);
            });
          });
        });
    }
  
    // ---------- FRIEND REQUESTS PAGE ----------
    const requestContainer = document.getElementById("requestContainer");
    const requestTemplate = document.querySelector("[data-request-template]");
    if (requestContainer && requestTemplate) {
      fetch("/show_friend_requests")
        .then(response => response.json())
        .then(data => {
          data.users.forEach(user => {
            const card = requestTemplate.content.cloneNode(true).children[0];
            const view_user = card.querySelector("[view-user-tag]");
            const view_profile = card.querySelector("[view-profile-tag]");
            const accept_button = card.querySelector("[accept-tag]");
            const reject_button = card.querySelector("[reject-tag]");
            const imageContainer = card.querySelector("[image-tag]");
  
            const img = document.createElement("img");
            const profile_pic = user.image_file;
            const fullName = `${user.first_name} ${user.last_name}`;
  
            img.src = profile_pic;
            img.alt = fullName;
            img.style.width = "50px";
            img.style.height = "50px";
            img.style.objectFit = "cover";
            img.classList.add("rounded-circle");
            imageContainer.appendChild(img);
  
            view_user.textContent = fullName;
            view_profile.textContent = "View Profile";
            view_profile.addEventListener("click", () => {
              window.location.href = `/view_other_user/${user.id}`;
            });
  
            accept_button.textContent = "accept";
            reject_button.textContent = "reject";
  
            accept_button.dataset.userId = user.id;
            accept_button.dataset.status = user.friend_status;
  
            reject_button.dataset.userId = user.id;
            reject_button.dataset.status = user.friend_status;
  
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
  
            reject_button.addEventListener("click", () => {
              const userId = reject_button.dataset.userId;
              card.style.display = "none";
              fetch(`/reject_friend/${userId}`, { method: "POST" })
                .then(response => response.json())
                .then(data => {
                  if (data.success) {
                    reject_button.textContent = data.new_label;
                    accept_button.disabled = true;
                    reject_button.disabled = true;
                    accept_button.style.display = "none";
                  }
                });
            });
  
            requestContainer.appendChild(card);
            card.style.display = "block";
          });
        });
    }
  });
  
// --------- FRIENDS PAGE -------------
const friendContainer = document.getElementById("friendContainer");
const friendTemplate = document.querySelector("[data-friend-template]");
    if (friendContainer && friendTemplate) {
let users = [];

fetch("/api_friends")
  .then(response => response.json())
  .then(data => {
    users = data.users.map(user => {  // keep the route the same if backend still returns `friends`
    const card = friendTemplate.content.cloneNode(true).children[0];

    //functions to display the user objects
    createProfilePic(user, card);
    showProfile(user, card);
    const fullName = showName(user, card);

      // Set up friend button logic
      setupFriendButton(user, card);

      // Add to container
      card.style.display = "flex";
      friendContainer.appendChild(card);

      return {
        name: fullName,
        element: card,
        friend_status: user.friend_status
      };
    });
  });
}
