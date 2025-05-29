export default {
  template: `
<div class="dashboard-container">
    <router-link class="btn btn-success btn-sm me-1" :to="{ name: 'adminDashboard' }"> Back to Admin Dashboard </router-link>
    <h3 v-if="chapters.length" class="mt-4">Chapters List</h3>
    <div class="row row-cols-1 row-cols-md-3 g-4" v-if="chapters.length">
      <div class="col" v-for="chapter in chapters" :key="chapter.id">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">{{ chapter.name }}</h5>
            <p class="card-text">Chapter ID: {{ chapter.id }}</p>
            <p class="card-text">Subject ID: {{ chapter.subject_id }}</p>
            <p class="card-text">Chapter Description: {{ chapter.description }}</p>
          </div>
          <div class="card-footer">
            <button class="btn btn-warning btn-sm me-1" @click="updateChapter(chapter.id)">Update</button>
            <button class="btn btn-danger btn-sm me-1" @click="deleteChapter(chapter.id)">Delete</button>
            <button class="btn btn-primary btn-sm" @click="createQuiz(chapter.id)">Create a Quiz</button>
            <button class="btn btn-info btn-sm" @click="checkQuiz(chapter.id)">Check Quizzes</button>
          </div>
        </div>
      </div>
    </div>
    <div class="dashboard-container" v-else>
          <h4>No chapters found. Create a chapter.</h4>
    </div>
</div>
    `,
  data() {
    return {
      chapters: [],
    };
  },
  mounted() {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      console.error("No token found. Redirecting to login.");
      this.$router.push("/login");
      return;
    }

    this.getChapters();
  },
  methods: {
    async getChapters() {
      const id = this.$route.params.id;
      try {
        const response = await fetch(
          `/get_chapters/${id}`
        );
        const data = await response.json();
        this.chapters = data;
      } catch (error) {
        console.error(error);
      }
    },
    // Updating a chapter
    async updateChapter(chapter_id) {
      this.$router.push(`/updateChapter/${chapter_id}`);
    },

    // Deleting a chapter
    async deleteChapter(id) {
      const response = await fetch(
        `/delete_chapter/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": JSON.parse(
              localStorage.getItem("auth_token")
            ), // token is required for authentication
          },
        }
      );
      if (response.ok) {
        alert(`Chapter deleted successfully`);
        // Refreshing the chapter list after deleting a chapter
        this.$router.push({ name: `adminDashboard` });
      } else {
        alert("Failed to delete chapter.");
      }
    },

    // Creating quiz for a chapter
    async createQuiz(id) {
      this.$router.push(`/createQuiz/${id}`);
    },

    // Checking the detais of a quiz
    async checkQuiz(id) {
      this.$router.push(`/checkQuiz/${id}`);
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

.dashboard-container h3 {
  color: #333;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

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

.btn-info:hover {
  background-color: #17a2b8;
}

`;
document.head.appendChild(style);