export default {
  template: `
  <div class="dashboard-container">
        <router-link class="btn btn-success btn-sm me-1" :to="{ name: 'adminDashboard'}"> Back to Admin Dashboard </router-link>
        <h3 v-if="questions.length" class="mt-4">Question List</h3>
        <div class="row row-cols-1 row-cols-md-3 g-4" v-if="questions.length">
          <div class="col" v-for="question in questions" :key="question.id">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">Question {{ question.id }}</h5>
                <p class="card-text">{{ question.question_statement }}</p>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">Option 1 : {{ question.option1 }}</li>
                  <li class="list-group-item">Option 2 : {{ question.option2 }}</li>
                  <li class="list-group-item">Option 3 : {{ question.option3 }}</li>
                  <li class="list-group-item">Option 4 : {{ question.option4 }}</li>
                </ul>
                <p class="card-text mt-2">Correct Option : {{ question.correct_option }}</p>
              </div>
              <div class="card-footer">
                <button class="btn btn-warning btn-sm me-1" @click="updateQuestion(question.id)">Update</button>
                <button class="btn btn-danger btn-sm" @click="deleteQuestion(question.id)">Delete</button>
              </div>
            </div>
          </div>
        </div>
        <div class="dashboard-container" v-else>
          <h4>No Questions found. Create a Questions.</h4>
        </div>
</div>
  `,
  data() {
    return {
      questions: [],
    };
  },
  mounted() {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      console.error("No token found. Redirecting to login.");
      this.$router.push("/login");
      return;
    }

    this.getQuestions();
  },
  methods: {
    // getting list of questions by calling the api with a quiz id
    async getQuestions() {
      try {
        const id = this.$route.params.id;
        const response = await fetch(
          `/get_questions//${id}`
        );
        this.questions = await response.json();
      } catch (error) {
        console.error(error);
      }
    },

    // Updating a question
    async updateQuestion(id) {
      this.$router.push(`/updateQuestion/${id}`);
    },

    // Deleting a question
    async deleteQuestion(id) {
      const response = await fetch(
        `/delete_question/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": JSON.parse(
              localStorage.getItem("auth_token")
            ),
          },
        }
      );
      if (response.ok) {
        alert(`Question deleted successfully`);
        // this.questionList();
        this.$router.push({ name: `adminDashboard` });
      } else {
        alert("Failed to delete question.");
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

.dashboard-container h3 {
  color: #333;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.card-body {
  font-family: 'Roboto', sans-serif;
}

.card-footer {
  display: flex;
  gap: 10px;
}

.btn {
  border-radius: 5px;
}

.btn-warning:hover {
  background-color: #ffcc00;
}

.btn-danger:hover {
  background-color: #ff3333;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-info:hover {
  background-color: #17a2b8;
}

`;
document.head.appendChild(style);