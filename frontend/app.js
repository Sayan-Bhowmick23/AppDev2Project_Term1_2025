import Navbar from "./components/Navbar.js"; // Ensure Navbar is defined
import router from "./utils/router.js";

const app = new Vue({
  el: "#app",
  template: `
    <div>
      <Navbar></Navbar>
      <router-view></router-view>
    </div>
  `,
  components: {
    Navbar,
  },
  router,
});
