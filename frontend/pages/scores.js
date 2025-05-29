export default {
  template: `
  <div class="container">
  <router-link to="/userDashboard" class="btn btn-secondary">Back to Dashboard</router-link> 
  <br/><br/><br/><br/>
    <h2>Scores</h2>
    <div class="container"  v-if="scores.length">
    <table border="1" class="table table-striped">
      <caption>Quiz Scores</caption>
      <thead>
        <tr>
          <th>Entry No.</th>
          <th>Quiz ID</th>
          <th>User ID</th>
          <th>User Score</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="score in scores" :key="score.id">
          <td>{{ score.id }}</td>
          <td>{{ score.quiz_id }}</td>
          <td>{{ score.user_id }}</td>
          <td>{{ score.total_scored }}</td>
        </tr>
      </tbody>
    </table>
    </div>
    <div class="container" v-else>
      <p> No scores found for this quiz. </p>
    </div>
  </div>
`,
  data() {
    return {
      id: this.$route.params.id,
      scores: [],
    };
  },
  mounted() {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      console.error("No token found. Redirecting to login.");
      this.$router.push("/login");
      return;
    }
    
    this.getScores();
  },
  methods: {
    async getScores() {
      try {
        const response = await fetch(
          `/get_scores/${this.id}`,
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
        this.scores = await response.json();
      } catch (error) {
        console.error(error);
      }
    },
  },
};

