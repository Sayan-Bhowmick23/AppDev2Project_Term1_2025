export default {
  template: `
     <div class="container mt-5">
      <router-link class="btn btn-dark btn-sm me-1" :to="{ name: 'adminDashboard' }"> Go Back To Admin Dashboard </router-link>
      <h2>Stats for Admin Dashboard</h2>
      <canvas id="adminChart"></canvas>
    </div>
    `,
  data() {
    return{
        chartData: null,
        chart: null,
    };
  },
  mounted() {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.error("No token found. Redirecting to login.");
      this.$router.push("/login");
      return;
    }
    this.fetchDashboardData();
  },
  methods: {
    async fetchDashboardData() {
      try {
        const response = await fetch(
          `/admin_dashboard_data`,
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
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        this.chartData = data;
        this.renderChart();
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    },
    renderChart() {
      const ctx = document.getElementById("adminChart").getContext("2d");

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Registered Users", "Users Attempting Quizzes"],
          datasets: [
            {
              label: "Number of Users",
              data: [
                this.chartData.total_users,
                this.chartData.users_attempting_quizzes,
              ],
              backgroundColor: [
                "rgba(75, 192, 192, 0.5)",
                "rgba(153, 102, 255, 0.5)",
              ],
              borderColor: ["rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
  },
};