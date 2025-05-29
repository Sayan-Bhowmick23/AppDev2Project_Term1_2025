export default {
  template: `
        <div class="dashboard-container">
          <div class="card">
            <h1 class="header">{{ title }}</h1>
            <p class="description">{{ p1 }}</p>
            <p class="description">{{ p2 }}</p>
          </div>
        </div>
    `,
  data() {
    return {
      title: "Welcome to the Home Page of the QuizMaster App",
      p1: "This is the home page of the QuizMaster App. Here, you can find various quizzes to test your knowledge and skills.",
      p2: "If you haven't registered already the please register to continue or else login to test your knowledge",
    };
  },
};

// Adding CSS styles dynamically
const style = document.createElement("style");
style.textContent = `
  h1,p {
    color: #333;
    font-size: 2rem;
    margin-top: 2rem;
    text-align: center;
  }
  .header {
    color: #333;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    transition: color 0.3s ease, transform 0.3s ease;
  }
  .description {
    color: #555;
    font-size: 1.2rem;
    margin-bottom: 1rem;
    line-height: 1.6;
    transition: color 0.3s ease;
  }
  .header:hover {
    color: #5151E5;
    transform: scale(1.05);
  }
  .description:hover {
    color: #333;
  }
`;
document.head.appendChild(style);
