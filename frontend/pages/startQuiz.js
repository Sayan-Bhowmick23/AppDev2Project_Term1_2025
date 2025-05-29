export default {
  template: `
<div class="container">
  <div v-if="currentQuestion">
    <h2>Quiz Page</h2>
    <p>Q.No. {{ currentQuestionIndex + 1 }}/{{ questions.length }}</p>
    <p>{{ currentQuestion.question_statement }}</p>
    <ul>
      <li v-for="(option, index) in currentQuestion.options" :key="index">
        <input type="radio" :value="index" v-model="selectedOption" /> {{ option }}
      </li>
    </ul>
    <p><strong>Time Left: {{ formattedTime }}</strong></p>
    <button class="btn btn-success btn-sm" @click="nextQuestion">Save and Next</button>
    <button class="btn btn-warning btn-sm" @click="submitQuiz">Submit</button>
  </div>
</div>  
`,
  mounted() {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      console.error("No token found. Redirecting to login.");
      this.$router.push("/login");
      return;
    }

    this.getQuestions();
    this.getTimeDuration();
    this.restoreTimer();
    this.startTimer();
  },
  data() {
    return {
      currentQuestionIndex: 0,
      selectedOption: null,
      answers: [],
      questions: [],
      id: this.$route.params.id,
      timeLeft: null,
      timerInterval: null,
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    },
    formattedTime() {
      const hours = Math.floor(this.timeLeft / 3600);
      const minutes = Math.floor((this.timeLeft % 3600) / 60);
      const seconds = this.timeLeft % 60;

      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    },
  },
  methods: {
    nextQuestion() {
      this.answers.push(this.selectedOption);
      this.selectedOption = null;
      if (this.currentQuestionIndex + 1 < this.questions.length) {
        this.currentQuestionIndex++;
      }
    },

    async submitQuiz() {
      clearInterval(this.timerInterval);
      if (this.selectedOption !== null) {
        this.answers.push(this.selectedOption);
      }
      
      const payload = {
        quizId: this.id,
        userAnswers: this.answers,
      };

      // console.log(this.answers);

      try {
        const response = await fetch(`/submit_quiz`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": JSON.parse(localStorage.getItem("auth_token")),
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const result = await response.json();
        this.$router.push({ name: "QuizResults", params: { score: result.score } });
        
        localStorage.removeItem(`quiz_${this.id}_timeLeft`);
        
      } catch (error) {
        alert("Error submitting quiz:", error);
        console.error("Error submitting quiz:", error);
      }
    },

    async getQuestions() {
      const response = await fetch(
        `/get_questions/${this.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": JSON.parse(localStorage.getItem("auth_token")),
          },
        }
      );
      
      const data = await response.json();
      
      this.questions = data.map((item) => ({
        ...item,
        options: [item.option1, item.option2, item.option3, item.option4],
      }));
    },

    async getTimeDuration() {
      const response = await fetch(
        `/get_time_duration/${this.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": JSON.parse(localStorage.getItem("auth_token")),
          },
        }
      );

      const data = await response.json();
      
      if (!localStorage.getItem(`quiz_${this.id}_timeLeft`)) {
        this.timeLeft = data.time_duration;
        localStorage.setItem(`quiz_${this.id}_timeLeft`, data.time_duration);
      }
    },

    startTimer() {
      this.timerInterval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
          localStorage.setItem(`quiz_${this.id}_timeLeft`, this.timeLeft);
        } else {
          clearInterval(this.timerInterval);
          alert("Time's up! Submitting your quiz.");
          this.submitQuiz();
        }
      }, 1000);
    },

    restoreTimer() {
      const savedTime = localStorage.getItem(`quiz_${this.id}_timeLeft`);
      
      if (savedTime) {
        this.timeLeft = parseInt(savedTime, 10);
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    localStorage.removeItem(`quiz_${this.id}_timeLeft`);
    
    clearInterval(this.timerInterval);

    next();
  },
};
