
export default {
  template: `
<div class="dashboard-container">
  <h1>{{ title }}</h1>
  <router-link class="btn btn-dark btn-sm-1" :to="{ name: 'adminStats' }"> Summary </router-link>

  <form @submit.prevent="search" class="form-group mt-4" style="width: 50%; margin: 0 auto;">
    <input class="input-field" type="text" placeholder="Search for Registered Users..." v-model="searchTerm" />
    <button class="btn btn-success btn-sm">Search</button>
    <p v-if="!this.quizzes">{{ msg }}</p>
  </form>
  <br>
  
  <h3 v-if="searchResults.length">Search Results</h3>
  <table class="table" v-if="searchResults.length">
    <thead>
      <tr>
        <th>User id</th>
        <th>Email</th>
        <th>Username</th>
        <th>Full Name</th>
        <th>Qualification</th>
        <th>Date of Birth</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in searchResults" :key="user.id">
        <td>{{ user.id }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.username }}</td>
        <td>{{ user.full_name }}</td>
        <td>{{ user.qualification }}</td>
        <td>{{ user.dob }}</td>
      </tr>
    </tbody>
  </table>
  <br><br>
  
  
  <h3 v-if="subjects.length" class="mt-4">Subjects List</h3>
  <br/>
  <div class="row row-cols-1 row-cols-md-3 g-4" v-if="subjects.length">
    <div class="col" v-for="subject in subjects" :key="subject.id">
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">{{ subject.name }}</h5>
          <p class="card-text">Subject ID: {{ subject.id }}</p>
          <p class="card-text">{{ subject.description }}</p>
        </div>
        <div class="card-footer">
          <button class="btn btn-warning btn-sm me-1" @click="updateSubject(subject.id)">Update</button>
          <button class="btn btn-danger btn-sm me-1" @click="deleteSubject(subject.id)">Delete</button>
          <button class="btn btn-primary btn-sm" @click="createChapter(subject.id)">Create a Chapter</button>
          <button class="btn btn-success btn-sm" @click="checkChapter(subject.id)">Check for Chapters</button>
        </div>
      </div>
    </div>
  </div>
  <br><br>
  <button class="btn btn-primary mb-3" @click="createSubject">Create a Subject</button>
  </br></br>

  <!--h3 v-if="users.length">Users List</h3>
  <table class="table" v-if="users.length">
    <thead>
      <tr>
        <th>User id</th>
        <th>Username</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.id }}</td>
        <td>{{ user.username }}</td>
        <td>{{ user.email }}</td>
      </tr>
    </tbody>
  </table -->
</div>

  `,
  data() {
    return {
      title:
        "Welcome to the admin dashboard. Here you can search for registered users, view reports, and more.",
      users: [],
      subjects: [],
      searchTerm: "",
      searchResults: [],
      msg: "",

      // Depricated Part
      chapters: [],
      quizzes: [],
      questions: [],
      answers: [],
    };
  },

  methods: {
    // search function
    async search() {
      try {
        const response = await fetch(`/search`, {
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
        // this.msg = error;
        alert("No Records Found: ", error);
        console.error("Error fetching Search Results:", error);
      }
    },

    // create subject
    async createSubject() {
      this.$router.push("/createSubject");
    },

    // update subject
    async updateSubject(id) {
      this.$router.push(`/updateSubject/${id}`);
    },

    // delete subject
    async deleteSubject(id) {
      const response = await fetch(
        `/delete_subject/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": JSON.parse(
              localStorage.getItem("auth_token")
            ),
          },
        }
      );
      if (response.ok) {
        alert(`Subject deleted successfully`);
        this.subjectList();
      } else {
        alert("Failed to delete subject.");
      }
    },

    // create chapter for a subject
    async createChapter(id) {
      this.$router.push(`/createChapter/${id}`);
    },

    // checking the details of chapters in a subject
    async checkChapter(id) {
      this.$router.push(`/checkChapters/${id}`);
    },

    // checking the details of questions in a quiz
    async checkQuestions(id) {
      this.$router.push(`/checkQuestions/${id}`);
    },

    // getting user's list
    async userList() {
      try {
        const response = await fetch("/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": JSON.parse(
              localStorage.getItem("auth_token")
            ),
          },
        });
        const data = await response.json();
        this.users = data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },

    // Depricated JS code

    // getting subject's list
    async subjectList() {
      try {
        const response = await fetch("/api/subjects", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": JSON.parse(
              localStorage.getItem("auth_token")
            ),
          },
        });
        const data = await response.json();
        this.subjects = data;
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    },

    // getting chapter's list
    async chapterList() {
      try {
        const response = await fetch("/api/chapters", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": JSON.parse(
              localStorage.getItem("auth_token")
            ),
          },
        });
        const data = await response.json();
        this.chapters = data;
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    },

    // getting quiz list
    async quizList() {
      try {
        const response = await fetch("/api/quizzes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": JSON.parse(
              localStorage.getItem("auth_token")
            ),
          },
        });
        const data = await response.json();
        this.quizzes = data;
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    },

    // getting question list
    async questionList() {
      try {
        const response = await fetch("/api/questions", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": JSON.parse(
              localStorage.getItem("auth_token")
            ),
          },
        });
        const data = await response.json();
        this.questions = data;
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    },
  },
  mounted() {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      console.error("No token found. Redirecting to login.");
      this.$router.push("/login");
      return;
    }

    this.userList();
    this.subjectList();
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
