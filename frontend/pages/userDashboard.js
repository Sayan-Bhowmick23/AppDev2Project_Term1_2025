export default {
  template: `
    <div class="dashboard-container">
        <h1> {{ title }} </h1>

        <router-link class="btn btn-dark btn-sm me-1" :to="{ name: 'previousAttempts' }"> Previous Attempts </router-link>
        <router-link class="btn btn-warning btn-sm me-1" :to="{ name: 'Stats' }"> Stats </router-link>

        <form @submit.prevent="search" class="form-group mt-4" style="width: 50%; margin: 0 auto;">
          <input class="input-field" type="text" placeholder="Search for Subjects..." v-model="searchTerm" />
          <button class="btn btn-success btn-sm">Search</button>
        </form>
        
        <h3 v-if="searchResults.length">Search Results</h3>
        <table class="table" v-if="searchResults.length">
          <thead>
            <tr>
              <th>Subject id</th>
              <th>Subject Name</th>
              <th>Subject Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="subject in searchResults" :key="subject.id">
              <td>{{ subject.id }}</td>
              <td>{{ subject.name }}</td>
              <td>{{ subject.description }}</td>
            </tr>
          </tbody>
        </table>
        <br><br>

        <h3 v-if="quizzes.length" class="mt-4">Quiz List</h3>
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
                <p class="card-text">Remarks: {{ quiz.remarks }}</p>
              </div>
              <div class="card-footer">
                <!--router-link :to="{ name: 'scores', params: {id: quiz.id} }" class="btn btn-primary btn-sm me-1"> View </!--router-link-->
                <!--router-link :to="{ name: 'startQuiz', params: {id: quiz.id} }" class="btn btn-success btn-sm me-1"> Start </!--router-link-->
                <button @click="checkQuizAvailability(quiz)" class="btn btn-success btn-sm me-1"> Start </button>
                <router-link :to="{ name: 'quizDetails', params: {id: quiz.id} }" class="btn btn-warning btn-sm me-1"> Details </router-link>
              </div>
            </div>
          </div>
        </div>
    </div>
    `,
  data() {
    return {
      title: "User Dashboard",
      quizzes: [],
      searchTerm: "",
      searchResults: [],
    };
  },
  mounted() {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      console.error("No token found. Redirecting to login.");
      this.$router.push("/login");
      return;
    }

    // console.log("Token found:", token);

    this.showQuiz();
  },
  methods: {
    // user search method
    async search() {
      try {
        const response = await fetch(`/search_subject`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": JSON.parse(
              localStorage.getItem("auth_token")
            ),
          },
          body: JSON.stringify({
            searchTerm: this.searchTerm,
          }),
        });
        if (!response.ok) {
          throw new Error("Error searching for users");
        }
        const data = await response.json();
        this.searchResults = data;
      } catch (error) {
        alert("No Records Found:", error);
        console.error("Error fetching Search Results:", error);
      }
    },

    // method to show all quizzes to any user who has logged in to the app
    async showQuiz() {
      const response = await fetch(`/get_all_quizzes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": JSON.parse(
            localStorage.getItem("auth_token")
          ),
        },
      });
      const data = await response.json();
      // console.log(data);
      this.quizzes = data;
    },
    checkQuizAvailability(quiz) {
      // Get current date in IST
      const now = new Date();
      const currentISTDate = new Date(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          now.getUTCHours() + 5, // Add 5 hours
          now.getUTCMinutes() + 30 // Add 30 minutes
      );
      const currentISTMidnight = new Date(
          currentISTDate.getFullYear(),
          currentISTDate.getMonth(),
          currentISTDate.getDate()
      );

      // Parse quiz date as IST midnight
      const quizDateParts = quiz.date_of_quiz.split('-');
      const quizISTMidnight = new Date(
          parseInt(quizDateParts[0]),
          parseInt(quizDateParts[1]) - 1, // Months are 0-based
          parseInt(quizDateParts[2])
      );

      console.log('Date Comparison (IST):', {
          currentISTMidnight: currentISTMidnight.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          quizISTMidnight: quizISTMidnight.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      });

      if (currentISTMidnight.getTime() !== quizISTMidnight.getTime()) {
          alert('Not allowed: Quiz is only available on ' + 
                quizISTMidnight.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }));
          return;
      }
      
      this.$router.push({ name: 'startQuiz', params: { id: quiz.id } });
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
    width: 50%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
  }
    .table {
    style="width: 50%; 
    margin: 0 auto;"
    }
`;
document.head.appendChild(style);


