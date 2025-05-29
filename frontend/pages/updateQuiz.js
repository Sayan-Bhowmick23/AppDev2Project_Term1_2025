export default {
  template: `
    <div class="dashboard-container">
      <h1>Update Quiz</h1>
      <form @submit.prevent="updateQuiz">
        <div class="form-group">
          <label for="quizId">Quiz ID:</label>
          <input class="input-field" type="text" id="quizId" :value="quiz.id" readonly>
        </div>
          <label for="chapterId">Chapter ID:</label>
          <input class="input-field" type="text" id="chapterid" :value="quiz.chapter_id" readonly>
        <div class="form-group">  
          <label for="dateOfQuiz">Quiz Date:</label>
          <input class="input-field" type="date" id="dateOfQuiz" v-model="quiz.date_of_quiz" placeholder="YYYY-MM-DD" required>
        </div>  
          <label for="timeDuration">Duration:</label>
          <input class="input-field" type="text" id="timeDuration" v-model="quiz.time_duration" placeholder="HH:MM:SS" required>
        <div class="form-group">  
          <label for="remarks">Remarks:</label>
          <input class="input-field" type="text" id="remarks" v-model="quiz.remarks">
        </div>  
          <br/>
          <button type="submit" class="btn btn-primary">Update Quiz</button>
          <button type="button" class="btn btn-secondary" @click="$router.go(-1)">Cancel</button>
      </form>
    </div>
  `,
  data() {
    return {
      quiz: {
        id: "",
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

    this.quiz.id = this.$route.params.id;
    this.getQuizDetails();
  },
  methods: {
    async getQuizDetails() {
      try {
        const response = await fetch(
          `/get_quiz/${this.quiz.id}` // Changed endpoint
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        this.quiz.id = data.id; // Ensure the ID is set correctly
        this.quiz.chapter_id = data.chapter_id;
        this.quiz.date_of_quiz = data.date_of_quiz;
        this.quiz.time_duration = data.time_duration;
        this.quiz.remarks = data.remarks;
      } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to load quiz details");
      }
    },
    async updateQuiz() {
      try {
        const response = await fetch(
          `/update_quiz/${this.quiz.id}`, // Changed endpoint
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authentication-Token": JSON.parse(
                localStorage.getItem("auth_token")
              ), // token is required for authentication
            },
            body: JSON.stringify(this.quiz),
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        alert("Quiz updated successfully");
        this.$router.push({
          name: `checkQuiz`,
          params: { id: this.quiz.chapter_id },
        }); // Redirect to checkQuiz page" });
      } catch (error) {
        console.error("Update error:", error);
        alert("Failed to update quiz");
      }
    },
  },
};

// Dynamically adding CSS styles
const style = document.createElement("style");
style.textContent = `

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

.btn-success:hover {
  background-color: #28a745;
}

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
  .table {
    style="width: 50%; 
    margin: 0 auto;"
  }
  .input-field {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
  }
`;
document.head.appendChild(style);
