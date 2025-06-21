import { UserCard } from './usercard.js';
import { WorkoutCard } from './workoutcard.js';
import { convertTimezone, convertUnits, searchUser, searchWorkout } from './newfunctions.js';

// ---------- BASE HTML CONTENT ----------
let menu = document.getElementById("dropdownMenu");
let button = document.getElementById("dropdownMenuButton");

function toggleDropdown() {
  // add click event listener
  if (menu.style.display === "none" || menu.style.display === "") {
    menu.style.display = "block";
  } else {
    menu.style.display = "none";
  }
}

// get users time zone
document.addEventListener("DOMContentLoaded", function () {
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
const workoutTemplate = document.querySelector("[data-workout-template]");
const feedTemplate = document.querySelector("[data-feed-template]");
const feedContainer = document.getElementById("feedContainer");

if (workoutTemplate && feedTemplate && feedContainer) {
  const mode = "feed";
  fetch("/api_feed")
    .then(response => response.json())
    .then(data => {
      data.users.forEach(user => {
        if (!user.workouts || user.workouts.length === 0) return;
        // nested loop so each workout can be on an individual card
        user.workouts.forEach(workout => {
          const singleWorkout = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            image_file: user.image_file,
            workouts: [workout],
            friend_status: user.friend_status
          };

          const userCard = new UserCard(
            singleWorkout,
            feedTemplate,
            mode,
            workoutTemplate
          );

          feedContainer.appendChild(userCard.getElement());
        });
      });
    });
}

// ---------- FRIEND REQUESTS PAGE ----------
const requestTemplate = document.querySelector("[data-request-template]");
const requestContainer = document.getElementById("requestContainer");

if (requestTemplate && requestContainer) {
  const mode = "friend_requests";
  fetch("/show_friend_requests")
    .then(response => response.json())
    .then(data => {
      data.users.forEach(user => {
        const userCard = new UserCard(
          user,
          requestTemplate,
          mode,
          convertTimezone,
          convertUnits
        );
        const card = userCard.getElement();
        card.style.display = "block";
        requestContainer.appendChild(userCard.getElement());
      });
    });
}

// ---------- FRIENDS PAGE ----------
const friendTemplate = document.querySelector("[data-friend-template]");
const friendContainer = document.getElementById("friendContainer");

if (friendTemplate && friendContainer) {
  const mode = "friends";
  fetch("/api_friends")
    .then(response => response.json())
    .then(data => {
      const users = data.users.map(user => {
        const userCard = new UserCard(
          user,
          friendTemplate,
          mode,
          convertTimezone,
          convertUnits
        );
        const card = userCard.getElement();
        card.style.display = "flex";
        friendContainer.appendChild(userCard.getElement());
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
  const mode = "search_users";
  fetch("/api_search_users")
    .then(response => response.json())
    .then(data => {
      const users = data.users.map(user => {
        const userCard = new UserCard(
          user,
          searchTemplate,
          mode
        );
        const card = userCard.getElement();
        card.style.display = "none";
        searchContainer.appendChild(userCard.getElement());
        const fullName = userCard.getFullName();
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
const workoutCardTemplate = document.querySelector("[data-workout-template]");
const workoutCardContainer = document.getElementById("workoutContainer");

if (workoutCardTemplate && workoutCardContainer) {
  const mode = "view_workouts";
  let workouts = [];
  fetch("/api_view_workouts")
    .then(response => response.json())
    .then(data => {
      workouts = data.workouts.map(workout => {
        const workoutCard = new WorkoutCard(
          workout,
          workoutCardTemplate,
          mode
        );

        const card = workoutCard.getElement();
        workout.element = card;
        workoutCardContainer.appendChild(card);

        return workout;
      });

      searchWorkout(workouts);
    });
}
