export default {
  template: `
       <div class="container">
            <h1>Update Question</h1>
            <form @submit.prevent="updateQuestion">
                <div class="form-group">
                    <label for="questionId">Question Id</label>
                    <input type="text" class="form-control" id="question_id" v-model="question_id" readonly>
                </div>
                <div class="form-group">
                    <label for="quizId">Quiz Id</label>
                    <input type="text" class="form-control" id="quiz_id" v-model="quiz_id" readonly>
                </div>
                <div class="form-group">
                    <label for="question_statement">Question Statement</label>
                    <input type="text" class="form-control" id="question_statment" v-model="question_statement">
                </div>
                <div class="form-group">
                    <label for="option1">Option 1</label>
                    <input type="text" class="form-control" id="option1" v-model="option1">
                </div>
                <div class="form-group">
                    <label for="option2">Option 2</label>
                    <input type="text" class="form-control" id="option2" v-model="option2">
                </div>
                <div class="form-group">
                    <label for="option3">Option 3</label>
                    <input type="text" class="form-control" id="option3" v-model="option3">
                </div>
                <div class="form-group">
                    <label for="option4">Option 4</label>
                    <input type="text" class="form-control" id="option4" v-model="option4">
                </div>
                <div class="form-group">
                    <label for="correct_option">Correct Option</label>
                    <input type="text" class="form-control" id="correct_option" v-model="correct_option">
                </div>
                <button type="submit" class="btn btn-primary">Update Question</button>
                <button type="button" class="btn btn-secondary" @click="$router.go(-1)">Cancel</button>
            </form>
        </div>
    `,
  data() {
    return {
      question_id: "",
      quiz_id: "",
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
    
    this.getQuestion();
  },
  methods: {
    async getQuestion() {
      const response = await fetch(
        `/get_question/${this.$route.params.id}`
      );
      const data = await response.json();
      this.question_id = data.id;
      this.quiz_id = data.quiz_id;
      this.question_statement = data.question_statement;
      this.option1 = data.option1;
      this.option2 = data.option2;
      this.option3 = data.option3;
      this.option4 = data.option4;
      this.correct_option = data.correct_option;
    },
    async updateQuestion() {
      const response = await fetch(
        `/update_question/${this.question_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": JSON.parse(
              localStorage.getItem("auth_token")
            ), // token is required for authentication
          },
          body: JSON.stringify({
            question_statement: this.question_statement,
            option1: this.option1,
            option2: this.option2,
            option3: this.option3,
            option4: this.option4,
            correct_option: this.correct_option,
          }),
        }
      );
      if (response.ok) {
        alert(`Question updated successfully`);
        this.$router.push({name: `adminDashboard`});
      } else {
        alert("Failed to update question.");
      }
    },
  },
};