export default {
  template: `
    <div class="register-container">
        <br>
        <label for="email" class="form-group">Email:</label>
        <input type="text" class="input-field" v-model="email"/>

        <label for="username" class="form-group">Username:</label>
        <input type="text" class="input-field" v-model="username"/>
        
        <label for="password" class="form-group">Password:</label>
        <input type="password" class="input-field" v-model="password"/> 
        
        <label for="full_name" class="form-group">Full Name:</label>
        <input type="text" class="input-field" v-model="full_name"/> 
        
        <label for="qualification" class="form-group">Qualification:</label>
        <input type="text" class="input-field" v-model="qualification"/> 
        
        <label for="DOB" class="form-group">DOB:</label>
        <input type="date" id="DOB" class="input-field" v-model="dob"/> 
        <br/><br/>
        <!--input type="text" class="input-field" placeholder="Role Field, Put 'user' for registration" v-model="role"/ -->
        <label for="roleDropdown" class="dropdown-label">Choose your Role:</label>
        <select id="roleDropdown" class="dropdown-field" v-model="role">
          <option value="user">user</option>
        </select> &nbsp;&nbsp;
        <br/><br/>
        
        <button class="btn btn-primary register-button" @click="signUp"> Register </button>
    </div>
  `,
  data() {
    return {
      email: null,
      password: null,
      username: null,
      role: null,
      full_name: null,
      qualification: null,
      dob: null,
    };
  },
  methods: {
    async signUp() {
      try {
        const res = await fetch(`/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
            username: this.username,
            role: this.role,
            full_name: this.full_name,
            qualification: this.qualification,
            dob: this.dob,
          }),
        });
        if (res.ok) {
          alert("Registered Successful!");
          this.email = null;
          this.password = null;
          this.username = null;
          this.role = null;
          this.full_name = null;
          this.qualification = null;
          this.dob = null;
        } else {
          throw new Error("Failed to register");
        }
      } catch (error) {
        alert(error);
        console.error("Error registering:", error);
      }
    },
  },
};

// Add the CSS as a string within the file
const style = document.createElement("style");
style.textContent = `
  .register-container {
    max-width: 400px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .input-field {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
  }

  .register-button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
  }

  .register-button:hover {
    background-color: #0056b3;
  }

  input::placeholder {
    color: #aaa;
    font-size: 14px;
  }
`;
document.head.appendChild(style);

