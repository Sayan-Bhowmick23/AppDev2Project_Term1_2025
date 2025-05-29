export default {
  template: `
        <div class="container">
            <h1>Update Chapter</h1>
            <form @submit.prevent="updateChapter">
                <div class="form-group">
                    <label for="chapterId">Chapter id</label>
                    <input type="text" class="form-control" id="chapterid" :value="chapter.id" readonly>
                    <label for="subjectId">Subject id</label>
                    <input type="text" class="form-control" id="subjectid" :value="chapter.subjectId" readonly>
                    <label for="chapterName">Chapter Name</label>
                    <input type="text" class="form-control" id="chapterName" :value="chapter.name" v-model="chapter.name">
                    <label for="chapterDescription">Subject Description</label>
                    <input type="text" class="form-control" id="chapterDescription" :value ="chapter.description" v-model="chapter.description"> 
                    <br/>
                    <button type="submit" class="btn btn-primary" @click="updateChapter(chapter.id)">Update chapter</button>
                    <button type="button" class="btn btn-secondary" @click="$router.go(-1)">Cancel</button>
        </div>
    `,
  data() {
    return {
      chapter: {
        id: "",
        subjectId: "",
        name: "",
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
    
    this.chapter.id = this.$route.params.id;
    this.getChapters();
  },
  methods: {
    async getChapters() {
      try {
        const response = await fetch(
          `/get_chapter/${this.chapter.id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.chapter.id = data.id
        this.chapter.subjectId = data.subjectId;
        this.chapter.name = data.name;
        this.chapter.description = data.description;
      } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to load chapter details");
      }
    },
    async updateChapter(id) {
      // Implement your logic to update the subject here
      const name = document.getElementById("chapterName").value;
      const description = document.getElementById("chapterDescription").value;
      try {
        const response = await fetch(
          `/update_chapter/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authentication-Token": JSON.parse(
                localStorage.getItem("auth_token")
              ), // token is required for authentication
            },
            body: JSON.stringify({
              name,
              description,
            }),
          }
        );
        const data = await response.json();
        alert("Chapter updated successfully");
        // this.$router.push({ name: `checkChapter`, params: { id: this.chapter.subjectId } }); // Redirect to checkChapter page
        this.$router.push({ name: `adminDashboard` }); // Redirect to checkChapter page
      } catch (error) {
        console.error(error);
      }
    },
  },
};
