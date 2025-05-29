export default {
  template: `
    <div class="container mt-5">
      <router-link class="btn btn-dark btn-sm me-1" :to="{ name: 'userDashboard' }"> Go Back To User Dashboard </router-link>
      <button class="btn btn-warning btn-sm me-1" @click="generateCSV"> Download Report </button>
      <h2>User Performance for Attempted Quizzes</h2>
      <canvas id="performanceChart"></canvas>
    </div>
  `,
  data() {
    return {
      performanceData: [],
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

    this.fetchPerformanceData();
  },
  methods: {
    // Generate CSV method
    async generateCSV() {
      try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch(`/generate_CSV`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": JSON.parse(token),
          },
        });

        const responseText = await response.text();
        // console.log("Raw response:", responseText);
        
        if (!response.ok) {
          let errorData;
          try {
            errorData = JSON.parse(responseText);
          } catch (e) {
            errorData = { message: responseText };
          }
          throw new Error(errorData.message || "Failed to generate CSV.");
        }

        const data = JSON.parse(responseText);
        const task_id = data.task_id;
        this.getCSV(task_id);
      } catch (error) {
        // alert(`Error generating CSV: ${error.message}`);
        alert(`Error generating CSV: No Records found for you, please atempt a quiz to get your performance data in CSV`);
        console.error("Error generating CSV:", error);
      }
    },

    // Get CSV method with timeout
    async getCSV(id, retries = 10) {
      try {
        const token = localStorage.getItem("auth_token");
        let response = await fetch(`/get_CSV/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // "Authentication-Token": JSON.parse(token),
          },
        });

        if (response.status === 202) {
          if (retries > 0) {
            setTimeout(() => this.getCSV(id, retries - 1), 3000);
          } else {
            alert("CSV generation timed out. Please try again later.");
          }
          return;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to retrieve CSV.");
        }

        // Redirect to the CSV file URL for download
        const csvUrl = `/get_CSV/${id}`;
        window.location.href = csvUrl;
      } catch (error) {
        alert(
          `Error generating CSV: No Records found for you, please attempt a quiz to get your performance data in CSV`
        );
        console.error("Error retrieving CSV:", error);
      }
    },

    async fetchPerformanceData() {
      try {
        const response = await fetch(`/user_performance`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": JSON.parse(
              localStorage.getItem("auth_token")
            ),
          },
        });
        if (!response.ok) {
          throw new Error("Error fetching performance data");
        }
        const data = await response.json();
        this.performanceData = data;
        // console.log(this.performanceData);
        // console.log(this.performanceData[0].quiz_name);
        // console.log(this.performanceData[0].total_scored);
        this.renderChart();
      } catch (error) {
        console.error("Error fetching performance data:", error);
      }
    },
    renderChart() {
      const labels = this.performanceData.map((item) => item.quiz_name);
      const scores = this.performanceData.map((item) => item.total_scored);

      const ctx = document.getElementById("performanceChart").getContext("2d");
      if (this.chart) {
        this.chart.destroy();
      }
      this.chart = new Chart(ctx, {
        type: "line", // Change to 'line', 'pie', etc., if needed
        data: {
          labels: labels,
          datasets: [
            {
              label: "Total Scored",
              data: scores,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
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
            x: {
              ticks: {
                autoSkip: false,
              },
            },
          },
        },
      });
    },
  },
};
