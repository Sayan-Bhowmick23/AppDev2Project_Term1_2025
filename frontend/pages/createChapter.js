export default {
  template: `
    <div class="container">
        <h1>Create a Chapter</h1>
        <form @submit.prevent="createChapter">
            <div class="form-group">
                <label for="subjectId">Subject ID:</label>
                <input type="text" class="form-control" id="subjectId" :value="chapter.subjectId" readonly>
                <label for="name">Name:</label>
                <input type="text" class="form-control" v-model="chapter.name" required>
            </div>
            <div class="form-group">
                <label for="description">Description:</label>
                <textarea class="form-control" v-model="chapter.description" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Create</button>
            <button type="button" class="btn btn-secondary" @click="$router.go(-1)">Cancel</button>
        </form>    
    </div>
    `,
  data() {
    return {
      chapter: {
        name: "",
        subjectId: this.$route.params.id,
        description: "",
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
    
  },
  methods: {
    async createChapter() {
      try {
        const response = await fetch(
          `create_chapter/${this.chapter.subjectId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authentication-Token": JSON.parse(
                localStorage.getItem("auth_token")
              ), // token is required for authentication
            },
            body: JSON.stringify(this.chapter),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to create chapter");
        }

        alert(`Chapter created successfully`);
        this.$router.push({ name: "adminDashboard" });
      } catch (error) {
        console.error("Error:", error);
        alert(error.message || "An error occurred while creating the chapter");
      }
    },
  },
};
