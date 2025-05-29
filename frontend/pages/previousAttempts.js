export default {
  template: `
        <div class="dashboard-container">
            <router-link :to="{ name: 'userDashboard' }" class="btn btn-warning btn-sm me-1"> Back to User Dashboard </router-link>
            <h1 style="color: green"> See Your Previous Attempts Here </h1>
            <br><br>
            <h3 v-if="previousAttempts.length" class="mt-4">{{ title }}</h3>
            <br/>
                <div class="row row-cols-1 row-cols-md-3 g-4" v-if="previousAttempts.length">
                    <div class="col" v-for="attempt in previousAttempts" :key="attempt.id">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title">Entry ID: {{ attempt.id }}</h5>
                                <p class="card-text">User Name: {{ attempt.user_name }}</p>
                                <p class="card-text">Subject Name: {{ attempt.subject_name }}</p>
                                <p class="card-text">Chapter Name: {{ attempt.chapter_name }}</p>
                                <p class="card-text">Number of Questions: {{ attempt.number_of_questions }}</p>
                                <p class="card-text">Date of Quiz: {{ attempt.date_of_quiz }}</p>
                                <p class="card-text">Duration: {{ attempt.time_duration }}</p>
                                <p class="card-text">Your Score: {{ attempt.total_scored }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            <div class="dashboard-container" v-else>
                <h4 style="color: red">No Previous Attempts</h4>      
            </div>    
        </div>
    `,
  data() {
    return {
      title: "Previous Attempts",
      previousAttempts: [],
    };
  },
  mounted() {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.error("No token found. Redirecting to login.");
      this.$router.push("/login");
      return;
    }
    this.previousAttempt();
  },
  methods: {
    async previousAttempt() {
      const response = await fetch(`/previousAttempts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": JSON.parse(
            localStorage.getItem("auth_token")
          ),
        },
      });
      if (!response.ok) {
        throw new Error("Error fetching previous attempts");
      }
      const data = await response.json();
      this.previousAttempts = data;
    },
  },
};

// Dynamically adding CSS styles
const style = document.createElement("style");
style.textContent = `
  .dashboard-container {
    text-align: center;
    padding: 20px;
  }
  .dashboard-container h1 {
    color: #333;
    font-size: 24px;
    font-weight: 500;
    text-align: center;
    margin-top: 20px;
    margin-bottom: 20px;
    font-family: Roboto;
  }
  .dashboard-container button {
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;
    font-family: Arial, sans-serif;
  }
  .dashboard-container button:hover {
    background-color: rgb(243, 247, 246);
    color: black;
  }
  .dashboard-container p {
    color: #666;
    font-size: 16px;
    line-height: 1.5;
    margin-bottom: 20px;
    font-family: Arial, sans-serif;
    text-align: center;
  }
  .input-field {
    width: 50%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
  }
    .table {
    style="width: 50%; 
    margin: 0 auto;"
    }
`;
document.head.appendChild(style);

