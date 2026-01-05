<template>
  <div class="users">
    <div class="usersCard">

      <div class="topBar">
        <button class="backButton" @click="$router.push('/admin')">
          ← Back
        </button>
      </div>

      <h1 class="title">Registered Users</h1>

  <div v-if="users.length" class="content">
  <ul class="usersList">
    <li v-for="user in users" :key="user._id">
      <span>{{ user.userId }}</span>
      <span>{{ user.language }}</span>
    </li>
  </ul>
</div>

    </div>
  </div>
</template>

<script>
import { Api } from "@/Api";

export default {
  name: "AdminUsersPage",

  data() {
    return {
      users: []
    };
  },
  async mounted() {
    await this.fetchUsers();
  },

  methods: {
    async fetchUsers() {
      try {
        const res = await Api.get("/users");
        this.users = res.data;
      } catch (err) {
        alert("Failed to load users");
      }
    }
  }
};
</script>

<style scoped>@import "../styles/UsersPage.css";</style>
