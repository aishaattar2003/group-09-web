<template>
  <div class="settings">
    <div class="card">
      <h2>Settings</h2>

      <button @click="main">Main Page</button>
      <button @click="logout">Log out</button>
      <button @click="cancel">Cancel</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SettingsPopup",

  methods: {
    main() {
      this.$router.push("/main");
    },
    logout() {
      this.$router.push("/");
    },
    cancel() {
      this.$emit("close");
    }
  }
};
</script>

<style scoped>@import "../styles/NavigatePage.css";</style>
