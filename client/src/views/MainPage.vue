<template>
  <nav class="soft-navbar">
    <div class="nav-left">
      <a class="nav-item" @click="$router.push('/main')">Home</a>
    </div>

    <div class="nav-right">
    <a v-if="!isAdmin" class="nav-item" @click="$router.push('/contact')">Contact</a>
    <a class="nav-item" @click="$router.push(isAdmin ? '/admin' : '/profile')"> {{ isAdmin ? 'Admin' : 'Profile' }}</a>
    </div>
  </nav>

  <div class="page-wrapper">
    <div class="page-card">

      <h1 class="title">HOME PAGE</h1>

      <div class="room">

        <!-- LOCAL ROOM -->
        <router-link 
        v-if="user && user.language === 'swe'" 
        to="/localroom" class="room-card">
          <div class="room-text">LOCAL ROOM</div>
          <img
            class="room-icon"
            src="@/assets/Local_logo.png"
            alt="Local Room"
          />
        </router-link>

        <!-- GLOBAL ROOM -->
        <router-link to="/globalroom" class="room-card">
          <div class="room-text">GLOBAL ROOM</div>
          <img
            class="room-icon"
            src="@/assets/Global_logo.png"
            alt="Global Room"
          />
        </router-link>

      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")),
    };
    
  },
  computed: {
    isAdmin() {
      return this.user.userId === "admin";
    }
  }
};
</script>


<style scoped>@import "../styles/MainPage.css";</style>
