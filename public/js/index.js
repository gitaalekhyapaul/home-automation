const loginButton = document.getElementById("login-button");
const signupButton = document.getElementById("signup-button");

loginButton.onclick = (ev) => {
  alert("Login");
};

signupButton.onclick = async (ev) => {
  try {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    if (email.value && password.value) {
      const response = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      });
      if (!response.ok) throw await response.json();
      alert("Successful Sign-up! Please login to continue!");
    } else alert("Email or password is blank.");
  } catch (err) {
    console.dir(err);
    alert(`APIError: ${err.error}`);
  }
};

loginButton.onclick = async (ev) => {
  try {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    if (email.value && password.value) {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      });
      if (!response.ok) throw await response.json();
      const res = await response.json();
      sessionStorage.setItem("authToken", res.authToken);
      alert("Welcome User!");
      window.location.replace("/dashboard");
    } else alert("Email or password is blank.");
  } catch (err) {
    console.dir(err);
    alert(`APIError: ${err.error}`);
  }
};
