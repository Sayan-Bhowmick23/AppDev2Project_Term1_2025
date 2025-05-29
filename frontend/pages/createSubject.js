export default {
  template: `
  <div class="container">
    <h1>Create a New Subject</h1>
    <form>
      <div class="form-group">
      <label for="name">Name:</label>
      <input type="text" class="form-control" id="name" v-model="subject.name" required>
      </div>
      <div class="form-group">
      <label for="description">Description:</label>
        <input type="text" class="form-control" id="description" v-model="subject.description" required>
      </div>
      <button type="submit" class="btn btn-primary" @click.prevent="createSubject">Create Subject</button>
      <button type="button" class="btn btn-secondary" @click="$router.go(-1)">Cancel</button>
    </form>
  </div>
  `,
  data() {
    return {
      subject: {
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
  },
  methods: {
    async createSubject() {
      const subjectName = this.subject.name;
      const subjectDescription = this.subject.description;
      if (!subjectName) {
        alert("subject name is required.");
        return;
      }
      if (!subjectDescription) {
        alert("subject description is required.");
        return;
      }
      try {
        // Log the input values for debugging purposes
        console.log("Creating subject with:", {
          subjectName,
          subjectDescription,
        });

        const response = await fetch("/create_subject", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": JSON.parse(
              localStorage.getItem("auth_token")
            ), // token is required for authentication
          },
          body: JSON.stringify({
            name: subjectName,
            description: subjectDescription,
          }),
        });

        // Log the status and entire response object to inspect server feedback
        console.log("Server response:", response);

        if (response.ok) {
          alert("Subject created successfully!");

          // Check if the subjectList method exists and then call it.
          if (typeof this.subjectList === "function") {
            this.subjectList();
          } else {
            console.error(
              "subjectList method is not defined in the current context."
            );
          }
        } else {
          // Attempt to get additional error details from the response
          const errorText = await response.text();
          alert("Failed to create subject. " + errorText);
          console.error("Error response:", errorText);
        }
      } catch (error) {
        console.error("Error creating subject:", error);
        alert(
          "An error occurred while creating the subject. Please try again later."
        );
      }
      this.subject.name = "";
      this.subject.description = "";
    },
  },
};
