export function convertUnits(workout, hours, minutes, seconds){
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
  
  export function convertTimezone(datetime, workout){
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
  

export function searchWorkout(workouts){
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
            console.log("Exercise dropdown:", exerciseOption);
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

    export function searchUser(users){
        const searchInput = document.querySelector("[data-search]");
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