export default {
  template: `
       <div class="container">
            <h1>Create Question for the Quiz</h1>
            <form @submit.prevent="createQuestion">
                <div class="form-group">
                    <label for="quizId">Quiz Id:</label>
                    <input type="text" id="quizId" v-model="quizId" class="form-control" readonly>
                </div>
                <div class="form-group">
                    <label for="question_statement">Question Statement:</label>
                    <input type="text" id="question_statement" v-model="question_statement" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="option1">Option 1:</label>
                    <input type="text" id="option1" v-model="option1" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="option2">Option 2:</label>
                    <input type="text" id="option2" v-model="option2" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="option3">Option 3:</label>
                    <input type="text" id="option3" v-model="option3" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="option4">Option 4:</label>
                    <input type="text" id="option4" v-model="option4" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="correct_option">Correct Answer:</label>
                    <input type="text" id="correct_option" v-model="correct_option" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary">Create Question</button>
                <button type="button" class="btn btn-secondary" @click="$router.go(-1)">Cancel</button>
            </form>
       </div>
       `,
  data() {
    return {
      quizId: "",
      question_statement: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correct_option: "",
    };
  },
  mounted() {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      console.error("No token found. Redirecting to login.");
      this.$router.push("/login");
      return;
    }
    
    this.quizId = this.$route.params.id;
  },
  methods: {
    async createQuestion() {
      const response = await fetch(
        `/create_question/${this.quizId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": JSON.parse(
              localStorage.getItem("auth_token")
            ), // token is required for authentication
          },
          body: JSON.stringify({
            question_statement: this.question_statement, // Added 'this.'
            option1: this.option1, // Added 'this.'
            option2: this.option2, // Added 'this.'
            option3: this.option3, // Added 'this.'
            option4: this.option4, // Added 'this.'
            correct_option: this.correct_option, // Added 'this.'
          }),
        }
      );
      if (response.ok) {
        alert(`Question created successfully`);
        // this.$router.push({ name:  `checkQuestions`, params: { id: this.quizId } });
        this.$router.push({ name:  `adminDashboard` });
      } else {
        alert("Failed to create question.");
        console.log(response);
      }
    },
  },
};