const routes = [
  {
    path: "/",
    component: () => import("../pages/home.js"),
    name: "home",
  },
  {
    path: "/login",
    component: () => import("../pages/LoginPage.js"),
    name: "login",
  },
  {
    path: "/register",
    component: () => import("../pages/RegisterPage.js"),
    name: "register",
  },
  {
    path: "/adminDashboard",
    component: () => import("../pages/adminDashboard.js"),
    name: "adminDashboard",
  },
  {
    path: "/userDashboard",
    component: () => import("../pages/userDashboard.js"),
    name: "userDashboard",
  },
  {
    path: "/createSubject",
    component: () => import("../pages/createSubject.js"),
    name: "createSubject",
  },
  {
    path: "/updateSubject/:id",
    component: () => import("../pages/updateSubject.js"),
    name: "updateSubject",
  },
  {
    path: "/createChapter/:id",
    component: () => import("../pages/createChapter.js"),
    name: "createChapter",
  },
  {
    path: "/updateChapter/:id",
    component: () => import("../pages/updateChapter.js"),
    name: "updateChapter",
  },
  {
    path: "/createQuiz/:id",
    component: () => import("../pages/createQuiz.js"),
    name: "createQuiz",
  },
  {
    path: "/updateQuiz/:id",
    component: () => import("../pages/updateQuiz.js"),
    name: "updateQuiz",
  },
  {
    path: "/createQuestion/:id",
    component: () => import("../pages/createQuestion.js"),
    name: "createQuestion",
  },
  {
    path: "/updateQuestion/:id",
    component: () => import("../pages/updateQuestion.js"),
    name: "updateQuestion",
  },
  {
    path: "/checkQuiz/:id",
    component: () => import("../pages/checkQuiz.js"),
    name: "checkQuiz",
  },
  {
    path: "/checkQuestions/:id",
    component: () => import("../pages/checkQuestions.js"),
    name: "checkQuestions",
  },
  {
    path: "/checkChapters/:id",
    component: () => import("../pages/checkChapters.js"),
    name: "checkChapters",
  },
  {
    path: "/timer/:id",
    component: () => import("../pages/timer.js"),
    name: "timer",
  },
  {
    path: "/startQuiz/:id",
    component: () => import("../pages/startQuiz.js"),
    name: "startQuiz",
  },
  {
    path: "/scores/:id",
    component: () => import("../pages/scores.js"),
    name: "scores",
  },
  {
    path: "/quizResults/:score",
    component: () => import("../pages/QuizResults.js"),
    name: "QuizResults",
  },
  {
    path: "/quizDetails/:id",
    component: () => import("../pages/quizDetails.js"),
    name: "quizDetails",
  },
  {
    path: "/previousAttempts",
    component: () => import("../pages/previousAttempts.js"),
    name: "previousAttempts",
  },
  {
    path: "/userStats",
    component: () => import("../pages/userStats.js"),
    name: "Stats",
  },
  {
    path: "/adminStats",
    component: () => import("../pages/adminStats.js"),
    name: "adminStats",
  },
];

const router = new VueRouter({
  routes,
});

export default router;
