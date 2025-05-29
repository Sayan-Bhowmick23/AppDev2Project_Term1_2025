export default {
  template: `
    <div class="dashboard-container">
        <router-link class="btn btn-success btn-sm me-1" :to="{ name: 'adminDashboard' }"> Back to Admin Dashboard </router-link>
        <h3 v-if="quizzes.length" class="mt-4">Quiz List</h3>
        <div class="row row-cols-1 row-cols-md-3 g-4" v-if="quizzes.length">
          <div class="col" v-for="quiz in quizzes" :key="quiz.id">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">Quiz {{ quiz.id }}</h5>
                <p class="card-text">Chapter ID: {{ quiz.chapter_id }}</p>
                <p class="card-text">Date: {{ quiz.date_of_quiz }}</p>
                <p class="card-text">Duration: {{ quiz.time_duration }}</p>
                <p class="card-text">Remarks: {{ quiz.remarks }}</p>
              </div>
              <div class="card-footer">
                <button class="btn btn-warning btn-sm me-1" @click="updateQuiz(quiz.id)">Update</button>
                <button class="btn btn-danger btn-sm me-1" @click="deleteQuiz(quiz.id)">Delete</button>
                <button class="btn btn-primary btn-sm me-1" @click="createQuestion(quiz.id)">Create Questions</button>
                <button class="btn btn-success btn-sm me-1" @click="checkQuestions(quiz.id)">Check Questions</button>
              </div>
            </div>
          </div>
        </div> 
        <div class="dashboard-container" v-else>
          <h4>No quizzes found. Create a quiz.</h4>
        </div>       
    </div>
  `,
  data() {
    return {
      quizzes: [],
    };
  },
  mounted() {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      console.error("No token found. Redirecting to login.");
      this.$router.push("/login");
      return;
    }

    this.getQuizzes();
  },
  methods: {
    // getting list of questions by calling the api with a quiz id
    async getQuizzes() {
      try {
        const id = this.$route.params.id;
        const response = await fetch(`/get_quizzes/${id}`);
        this.quizzes = await response.json();
      } catch (error) {
        console.error(error);
      }
    },

    // checking questions for the quiz
    async checkQuestions(quiz_id) {
      this.$router.push(`/checkQuestions/${quiz_id}`);
    },

    // Creating questions for a quiz
    async createQuestion(id) {
      this.$router.push(`/createQuestion/${id}`);
    },

    // Updating a quiz
    async updateQuiz(quiz_id) {
      this.$router.push(`/updateQuiz/${quiz_id}`);
    },

    // Deleting a quiz
    async deleteQuiz(id) {
      const response = await fetch(`/delete_quiz/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": JSON.parse(
            localStorage.getItem("auth_token")
          ), // token is required for authentication
        },
      });
      if (response.ok) {
        alert(`Quiz deleted successfully`);
        this.getQuizzes();
        this.$router.push({ name: "checkQuiz" });
      } else {
        alert("Failed to delete quiz.");
      }
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
  .table {
    style="width: 50%; 
    margin: 0 auto;"
  }
    .input-field {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
  }
`;
document.head.appendChild(style);