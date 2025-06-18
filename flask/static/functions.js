function setupFriendButton(user, card) {
    const friend_button = card.querySelector("[friend-tag]");
    friend_button.textContent =
        user.friend_status === "accepted" ? "Remove Friend" :
        user.friend_status === "pending" ? "Pending" :
        user.friend_status === "none" ? "Add Friend" : "Add Friend";

      friend_button.dataset.userId = user.id;
      friend_button.dataset.status = user.friend_status;

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
function showName(user, card){
    const name = card.querySelector("[name-tag]");
    const fullName = `${user.first_name} ${user.last_name}`;
      // Display name
      name.textContent = fullName;
      return fullName;

}
function showProfile(user, card) {
      const view_profile = card.querySelector("[view-profile-tag]");
      view_profile.textContent = "View Profile";
      view_profile.addEventListener("click", () => {
        window.location.href = `/view_other_user/${user.id}`;
      });
    }

function searchUser(){
    // Search input filtering
searchInput.addEventListener("input", (event) => {
    const value = event.target.value;
  
    // If the input is empty, show all users
    if (value === "") {
      users.forEach(user => {
        user.element.style.display = "flex";
      });
      return;
    }
  
    const regex = new RegExp("^" + value, "i");
  
    users.forEach(user => {
      const isVisible = regex.test(user.name);
      user.element.style.display = isVisible ? "block" : "none";
    });
  });
}

function createProfilePic(user, card){
    const imageContainer = card.querySelector("[image-tag]");
    // Display profile image
    const img = document.createElement("img");
    const profile_pic = user.image_file;
    img.src = profile_pic;
    img.alt = "profile_image";
    img.style.width = "50px";
    img.style.height = "50px";
    img.style.objectFit = "cover";
    img.classList.add("rounded-circle");
    imageContainer.appendChild(img);
}

function convertUnits(workout, hours, minutes, seconds){
  // Convert duration from minutes to h/m/s
  const totalSeconds = Math.round(workout.duration_minutes * 60);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) {
    hours.innerHTML = `<span class="number">${h}</span><span class="unit"> hr</span>`;
  } else {
    hours.style.display = "none";
  }

  if (m > 0) {
    minutes.innerHTML = `<span class="number">${m}</span><span class="unit"> min</span>`;
  } else {
    minutes.style.display = "none";
  }

  if (s > 0) {
    seconds.innerHTML = `<span class="number">${s}</span><span class="unit"> sec</span>`;
  } else {
    seconds.style.display = "none";
  }
}

function convertTimezone(datetime, workout){
  //convert to user's timezone
  const utcTimeString = workout.date
  const localTime = new Date(utcTimeString);
  const formatted = localTime.toLocaleString(undefined, {
  year: 'numeric', 
  month: '2-digit', 
  day: '2-digit',
  hour: '2-digit', 
  minute: '2-digit'
  });
  datetime.textContent = formatted;
}

function requestResponse(user, card){
  const accept_button = card.querySelector("[accept-tag]");
  const reject_button = card.querySelector("[reject-tag]");

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
}

function searchWorkout(workouts){
//code to handle search type
const searchInput = document.querySelector("[data-search]");
const searchOption = document.getElementById("search");
const exerciseOption = document.getElementById("exercise_option");
const dateOption = document.getElementById("date_option");
const durationOption = document.getElementById("duration_option");
let selected_search = "all"; // default

searchOption.addEventListener("change", (event) => {
    selected_search = event.target.value;
    // Hide all inputs
    dateOption.style.display = "none";
    exerciseOption.style.display = "none";
    searchInput.style.display = "none";
    durationOption.style.display = "none";

    switch (selected_search) {
        case "all":
            workouts.forEach(workout => {
                workout.element.style.display = "block";
            });
            break;

        case "exercise":
            exerciseOption.style.display = "block";
            break;

        case "date":
            dateOption.style.display = "block";
            break;

        case "duration_minutes":
            durationOption.style.display = "block";
            break;

        case "title":
            searchInput.style.display = "block";
            break;

        default:
            console.warn("Unknown search type selected:", selected_search);
            break;
    }
});
searchInput.addEventListener("input", (event) => {
    const value = event.target.value;
    // ^ means "starts with"
      // "i" makes it case-insensitive
    const regex = new RegExp("^" + value, "i"); 
    workouts.forEach(workout => {
        const isVisible = regex.test(workout.workout_title);
        workout.element.style.display = isVisible ? "block" : "none";
    });
});

//event listener for the dropdown itself
exerciseOption.addEventListener("change", (event) => {
    const selectedValue = event.target.value.toLowerCase();

    workouts.forEach(workout => {
        //returns a boolean for the selected workout- checks if user's input value exists
        const isVisible = workout.exercise.toLowerCase() === selectedValue;
        workout.element.style.display = isVisible ? "block" : "none";
    });
});

dateOption.addEventListener("change", (event) => {
    const selectedValue = event.target.value;

    workouts.forEach(workout => {
        //converts the date into a date object, then converts to a string. en-CA is for formatting
        const localDate = new Date(workout.date).toLocaleDateString("en-CA");
        //checks if the user's input value has any existing dates
        const isVisible = localDate === selectedValue
        workout.element.style.display = isVisible ? "block" : "none";
    });
});
durationOption.addEventListener("change", (event) => {
    const selectedValue = event.target.value;

    workouts.forEach(workout => {
        //converts string to floating point number
        const numericValue = parseFloat(selectedValue);
        const isVisible = Math.round(workout.duration_minutes) === numericValue;
        workout.element.style.display = isVisible ? "block" : "none";
    });
});
}