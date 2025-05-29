export default {
  template: `
    <div class="navbar-container">
      <template v-if="!isAuthenticated">
        <router-link
          to="/"
          name="home"
          class="btn btn-light navbar-link">
          Home
        </router-link>
        <router-link
          to="/login"
          name="login"
          class="btn btn-light navbar-link">
          Login
        </router-link>
        <router-link
          to="/register"
          name="register"
          class="btn btn-light navbar-link">
          Register
        </router-link>
      </template>
      <button
        v-else
        class="btn btn-light navbar-button"
        @click="logout">
        Logout
      </button>
    </div>
  `,
  data() {
    return {
      isAuthenticated: false,
    };
  },
  mounted() {
    this.checkAuthState();
  },
  methods: {
    checkAuthState() {
      this.isAuthenticated = !!localStorage.getItem("auth_token");
    },
    async logout() {
      try {
        const res = await fetch(`/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": JSON.parse(
              localStorage.getItem("auth_token")
            ),
          },
        });

        if (res.ok) {
          localStorage.removeItem("auth_token");
          this.isAuthenticated = false;
          alert("Logged out successfully");
          this.$router.push("/login");
        } else {
          const data = await res.json();
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error("Logout failed:", error);
        alert("An error occurred while logging out.");
      }
    },
  },
  watch: {
    $route() {
      this.checkAuthState();
    },
  },
};

// CSS styles remain the same

// Adding CSS styles dynamically
const style = document.createElement("style");
style.textContent = `
  .navbar-container {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f9fa;
    padding: 10px;
    border-bottom: 1px solid #ddd;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .navbar-link {
    margin: 0 10px;
    font-size: 16px;
    font-weight: 500;
    text-decoration: none;
    color: #007bff;
    padding: 8px 16px;
    border-radius: 5px;
    transition: background-color 0.3s, color 0.3s;
  }

  .navbar-link:hover {
    background-color: #007bff;
    color: white;
  }

  .navbar-button {
    font-size: 16px;
    font-weight: 500;
    color: #dc3545;
    background-color: transparent;
    border: 1px solid #dc3545;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
    margin-left: 20px;
  }

  .navbar-button:hover {
    background-color: #dc3545;
    color: white;
  }
`;
document.head.appendChild(style);
