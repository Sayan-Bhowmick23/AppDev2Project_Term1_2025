export default {
  template: `
        <div class="container">
            <h1>Update Subject</h1>
            <form @submit.prevent="updateSubject">
                <div class="form-group">
                    <label for="subjectId">Subject id</label>
                    <input type="text" class="form-control" id="id" :value="subjectId" readonly>
                    <label for="subjectName">Subject Name</label>
                    <input type="text" class="form-control" id="subjectName" :value= "subjectName "v-model="subjectName">
                    <label for="subjectDescription">Subject Description</label>
                    <input type="text" class="form-control" id="subjectDescription" :value = "subjectDescription" v-model="subjectDescription"> 
                    <br/>
                    <button type="submit" class="btn btn-primary" @click="updateSubject(subjectId)">Update Subject</button>
                    <button type="button" class="btn btn-secondary" @click="$router.go(-1)">Cancel</button>
        </div>
    `,
  data() {
    return {
      subjectId: "",
      subjectName: "",
      subjectDescription: "",
    };
  },
  mounted() {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      console.error("No token found. Redirecting to login.");
      this.$router.push("/login");
      return;
    }
    
    this.subjectId = this.$route.params.id;
    this.getSubjects();
  },
  methods: {
    async getSubjects() {
      try {
        const response = await fetch(
          `/get_subject/${this.subjectId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.subjectName = data.name;
        this.subjectDescription = data.description;
      } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to load subject details");
      }
    },
    async updateSubject(id) {
      // Implement your logic to update the subject here
      const name = document.getElementById("subjectName").value;
      const description = document.getElementById("subjectDescription").value;
      try {
        const response = await fetch(
          `/update_subject/${id}`,
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
        // console.log(data);
        alert("Subject updated successfully");
        this.$router.push({ name: "adminDashboard" });
      } catch (error) {
        console.error(error);
      }
    },
  },
};