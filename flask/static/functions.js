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
    const name = card.querySelector("[view-user-tag]");
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