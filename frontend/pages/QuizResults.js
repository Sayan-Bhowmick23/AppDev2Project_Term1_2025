export default {
  template: `
       <div class="container">
            <router-link :to="{ name: 'userDashboard' }" class="btn btn-secondary">Go Back to User Dashboard</router-link>
            <div class="row">
                <div class="col-md-12">
                    <h1>You have scored: {{ score }}</h1>
                </div>    
            </div>
        </div>    
       `,
  data() {
    return {
      score: this.$route.params.score,
    };
  },
  mounted() {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      console.error("No token found. Redirecting to login.");
      this.$router.push("/login");
      return;
    }
  },
};