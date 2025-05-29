export default {
  template: `
    <div class="login-container">
      <br>
      <label for="email" class="form-group"> Enter you email: </label>
      <input id="email" class="input-field" v-model="email" /> <br><br>
      
      <label for="password" class="form-group"> Enter your password: </label>
      <input id="password" class="input-field" type="password" v-model="password" /> &nbsp;&nbsp;
      <button class="btn btn-primary login-button" @click="submit">Login</button>
      <br><br><br>
      <p style="color: red;" v-if="message" :class="{ 'error-message': message === 'Invalid email or password' }">{{ message }}</p>
    </div>
  `,
  data() {
    return {
      email: null,
      password: null,
      message: "",
    };
  },
  methods: {
    async submit() {
      const res = await fetch(location.origin + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: this.email, password: this.password }),
      });
      if (res.ok) {
        // console.log("Logged in Successfully!");
        alert("Logged in Successfully!");
        const data = await res.json();
        
        // console.log("Token: ", data.token);
        // console.log("User: ", data.role);
        
        this.login = true;
        localStorage.setItem("auth_token", JSON.stringify(data.token));

        if (data.role == "admin") {
          //  alert("Welcome to Admin Dashboard");
          // this.login = true;
          // localStorage.setItem("user", JSON.stringify(data));
          // localStorage.setItem("auth_token", JSON.stringify(data.token));
          this.$router.push("/adminDashboard");
        } else {
          // console.log("User Dashboard");
          // alert("Welcome to User Dashboard");
          // localStorage.setItem("user", JSON.stringify(data));
          // this.login = true;
          // localStorage.setItem("auth_token", JSON.stringify(data.token));
          this.$router.push("/userDashboard");
        }
      } else {
        this.message = "Invalid email or password";
      }
    },
  },
};

// Adding CSS styles dynamically
const style = document.createElement("style");
style.textContent = `
  .login-container {
    max-width: 400px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .input-field {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
  }

  .login-button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
  }

  .login-button:hover {
    background-color: #0056b3;
  }

  input::placeholder {
    color: #aaa;
    font-size: 14px;
  }
`;
document.head.appendChild(style);

