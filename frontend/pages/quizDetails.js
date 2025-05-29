export default {
  template: `
    <div class="container">
        <br>
        <router-link :to="{ name: 'userDashboard' }" class="btn btn-primary btn-sm me-1">Back To Dashboard</router-link>
        <h3 v-if="quizzes.length" class="mt-4">{{ title }}</h3>
        <br/>
        <div class="row row-cols-1 row-cols-md-3 g-4" v-if="quizzes.length">
            <div class="col" v-for="quiz in quizzes" :key="quiz.id">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">Quiz ID: {{ quiz.id }}</h5>
                        <p class="card-text">Subject Name: {{ quiz.subject_name }}</p>
                        <p class="card-text">Chapter Name: {{ quiz.chapter_name }}</p>
                        <p class="card-text">Date of Quiz: {{ quiz.date_of_quiz }}</p>
                        <p class="card-text">Duration: {{ quiz.time_duration }}</p>
                        <p class="card-text">Number of Questions: {{ quiz.number_of_questions }}</p>
                        <p class="card-text">Remarks: {{ quiz.remarks }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>                
    `,
  data() {
    return {
      title: "Quiz Details",
      quizzes: [],
    };
  },
  mounted() {
    const id = this.$route.params.id;
    this.getQuizDetails(id);
  },
  methods: {
    async getQuizDetails(id) {
      const response = await fetch(
        `/get_quiz_all_details/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": JSON.parse(
              localStorage.getItem("auth_token")
            ),
          },
        }
      );
      if (!response.ok) {
        console.error("Error fetching quiz details:", response.statusText);
        return;
      }
      const data = await response.json();
      this.quizzes = data;
    },
  },
};