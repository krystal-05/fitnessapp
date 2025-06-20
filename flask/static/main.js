document.addEventListener("DOMContentLoaded", () => {
  // ---------- BASE HTML CONTENT ----------
  let menu = document.getElementById("dropdownMenu");
  let button = document.getElementById("dropdownMenuButton");
   function toggleDropdown() {
       //add click event listener
       if (menu.style.display === "none" || menu.style.display === "") {
           menu.style.display = "block";
       } else {
           menu.style.display = "none";
       }
       
   }
    //get users time zone
    document.addEventListener("DOMContentLoaded", function() {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
      // Send to backend if not already set
      fetch("/set_timezone", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ timezone: timezone })
      });
  });

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
        data.users.forEach(user => {
          user.workouts.forEach(workout => {
            const card = feedTemplate.content.cloneNode(true).children[0];
            createProfilePic(user, card);
            showProfile(user, card);
            showName(user, card);
            card.querySelector("[exercise-data]").textContent = workout.exercise;
            card.querySelector("[title-data]").textContent = workout.workout_title;
            convertTimezone(card.querySelector("[datetime-data]"), workout);
            convertUnits(workout,
              card.querySelector("[hours-data]"),
              card.querySelector("[minutes-data]"),
              card.querySelector("[seconds-data]")
            );
            feedContainer.appendChild(card);
          });
        });
      });
  }

  // ---------- FRIEND REQUESTS PAGE ----------
  const requestTemplate = document.querySelector("[data-request-template]");
  const requestContainer = document.getElementById("requestContainer");
  if (requestTemplate && requestContainer) {
    fetch("/show_friend_requests")
      .then(response => response.json())
      .then(data => {
        data.users.forEach(user => {
          const card = requestTemplate.content.cloneNode(true).children[0];
          createProfilePic(user, card);
          showName(user, card);
          showProfile(user, card);
          requestResponse(user, card);
          card.style.display = "block";
          requestContainer.appendChild(card);
        });
      });
  }

  // ---------- FRIENDS PAGE ----------
  const friendTemplate = document.querySelector("[data-friend-template]");
  const friendContainer = document.getElementById("friendContainer");
  if (friendTemplate && friendContainer) {
    fetch("/api_friends")
      .then(response => response.json())
      .then(data => {
        const users = data.users.map(user => {
          const card = friendTemplate.content.cloneNode(true).children[0];
          createProfilePic(user, card);
          showProfile(user, card);
          const fullName = showName(user, card);
          setupFriendButton(user, card);
          card.style.display = "flex";
          friendContainer.appendChild(card);

        return {
          name: fullName,
          element: card,
          friend_status: user.friend_status
        };
      });
        searchUser(users);
      });
  }

  // ---------- SEARCH USERS PAGE ----------
  const searchTemplate = document.querySelector("[data-search-template]");
  const searchContainer = document.getElementById("searchContainer");
  

  if (searchTemplate && searchContainer) {
    fetch("/api_search_users")
      .then(response => response.json())
      .then(data => {
        const users = data.users.map(user => {
          const card = searchTemplate.content.cloneNode(true).children[0];
          createProfilePic(user, card);
          showProfile(user, card);
          const fullName = showName(user, card);
          setupFriendButton(user, card);
          card.style.display = "none";
          searchContainer.appendChild(card);
          return {
            name: fullName,
            element: card,
            friend_status: user.friend_status
          };
        });
        searchUser(users); // make sure searchUser(users) accepts the users array
      });
  }

  // ---------- USER PROFILE PAGE ----------
  const statsTemplate = document.querySelector("[data-stats-template]");
  const statsContainer = document.getElementById("statsContainer");
  if (statsTemplate && statsContainer) {
    fetch("/user_page_api")
      .then(response => response.json())
      .then(data => {
        const card = statsTemplate.content.cloneNode(true);
        card.querySelector("[data-activities]").textContent = data.total_workouts;
        card.querySelector("[data-minutes]").textContent = data.total_minutes;
        card.querySelector("[data-awards]").textContent = data.awards;
        card.querySelector("[data-streak]").textContent = data.streak;
        statsContainer.appendChild(card);
      });
  }

  // ---------- OTHER USER PROFILE PAGE ----------
  const container = document.querySelector(".container");
  const otherStatsTemplate = document.querySelector("[data-other-stats-template]");
  const otherStatsContainer = document.getElementById("otherStatsContainer");
  if (container && otherStatsTemplate && otherStatsContainer) {
    const user_id = container.dataset.userId;
    fetch(`/view_other_user_api/${user_id}`)
      .then(response => response.json())
      .then(data => {
        const card = otherStatsTemplate.content.cloneNode(true);
        card.querySelector("[data-activities]").textContent = data.total_workouts;
        card.querySelector("[data-minutes]").textContent = data.total_minutes;
        card.querySelector("[data-awards]").textContent = data.awards;
        card.querySelector("[data-streak]").textContent = data.streak;
        otherStatsContainer.appendChild(card);
      });
  }

  // ---------- VIEW WORKOUT PAGE ----------
// ---------- VIEW WORKOUT PAGE ----------
const workoutCardTemplate = document.querySelector("[data-workout-template]");
const workoutCardContainer = document.getElementById("workoutContainer");

if (workoutCardTemplate && workoutCardContainer) {
  let workouts = [];
  fetch("/api_view_workouts")
    .then(response => response.json())
    .then(data => {
      workouts = data.workouts.map(workout => {
        const card = workoutCardTemplate.content.cloneNode(true).children[0];

        const exercise = card.querySelector("[exercise-data]");
        const title = card.querySelector("[title-data]");
        const hours = card.querySelector("[hours-data]");
        const minutes = card.querySelector("[minutes-data]");
        const seconds = card.querySelector("[seconds-data]");
        const datetime = card.querySelector("[datetime-data]");
        const edit_btn = card.querySelector("[edit-btn]");

        exercise.textContent = workout.exercise;
        title.textContent = workout.workout_title;

        edit_btn.onclick = () => {
          window.location.href = `/edit_workout/${workout.id}`;
        };

        convertTimezone(datetime, workout);
        convertUnits(workout, hours, minutes, seconds);

        workout.element = card;
            workoutCardContainer.appendChild(card);
            return workout;
      });
      searchWorkout(workouts);
  });
}

});
