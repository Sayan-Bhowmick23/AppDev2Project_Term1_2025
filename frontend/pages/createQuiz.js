export default {
  template: `
      <div class="dashboard-container">
            <h1>Create a Quiz</h1>
            <form @submit.prevent="createQuiz">
                <div class="form-group">
                    <label for="chapterId">Chapter Id:</label>
                    <input  class="input-field" type="text" id="chapterId" :value="quiz.chapter_id" readonly>
                </div>
                <div class="form-group">
                    <label for="dateOfQuiz">Quiz Date:</label>
                    <input class="input-field" type="date" id="dateOfQuiz" v-model="quiz.date_of_quiz" placeholder="YYYY-MM-DD" required>
                </div>
                <div class="form-group">
                    <label for="timeDuration">Duration:</label>
                    <input class="input-field" type="text" id="timeDuration" v-model="quiz.time_duration" placeholder="HH:MM:SS" required>
                </div>
                <div class="form-group">
                    <label for="remarks">Remarks:</label>
                    <input class="input-field" type="text" id="remarks" v-model="quiz.remarks">
                </div>
                <button type="submit" class="btn btn-primary">Create Quiz</button>
                <button type="button" class="btn btn-secondary" @click="$router.go(-1)">Cancel</button>
            </form>
      </div>
    `,
  data() {
    return {
      quiz: {
        chapter_id: "",
        date_of_quiz: "",
        time_duration: "",
        remarks: "",
      },
    };
  },
  mounted() {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      console.error("No token found. Redirecting to login.");
      this.$router.push("/login");
      return;
    }

    this.quiz.chapter_id = this.$route.params.id;
  },
  methods: {
    async createQuiz() {
      const response = await fetch(
        `/create_quiz/${this.quiz.chapter_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": JSON.parse(
              localStorage.getItem("auth_token")
            ), // token is required for authentication
          },
          body: JSON.stringify(this.quiz),
        }
      );
      if (response.ok) {
        alert("Quiz created successfully");
        this.$router.push({ name: `adminDashboard` });
      } else {
        alert("Failed to create quiz");
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
    .input-field {
    width: 20%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
  }
  input:read-only {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  color: #666;
  cursor: not-allowed;
}

`;
document.head.appendChild(style);