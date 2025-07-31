const words = ["creativity", "budget", "savings", "tracking"];
let index = 0;

function animateText() {
  const wordElement = document.getElementById("word");
  wordElement.textContent = words[index];
  index = (index + 1) % words.length;
}

// Call the animateText function every 1 second
setInterval(animateText, 1000);

document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;
    const expenseType = document.getElementById("expenseType").value;

    // Check if the "isNewUser" checkbox exists before accessing its "checked" property
    const isNewUserElement = document.getElementById("isNewUser");
    const isNewUser = isNewUserElement ? isNewUserElement.checked : false;

    const userData = {
      name,
      password,
      expenseType: isNewUser ? expenseType : undefined, // Only send expenseType if registering
    };

    const endpoint = isNewUser ? "/register" : "/login";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    };

    try {
      const response = await fetch(endpoint, options);
      const message = await response.text();
      if (response.ok) {
        alert(message);
        window.location.href = "index.html";
      } else {
        alert(message);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    // Clear form fields after submission
    document.getElementById("name").value = "";
    document.getElementById("password").value = "";
    document.getElementById("expenseType").value = "";
});
