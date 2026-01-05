<template>
  <div class="register">
    <div class="register-card">

      <h1 class="title">Sign up</h1>

      <form @submit.prevent="handleRegister">

        <div class="input-group">
          <label>Username:</label>
          <input v-model="userId" placeholder="Enter Username" />
        </div>

        <div class="input-group">
          <label>Personal Number:</label>
          <input v-model="personalNumber" placeholder="Enter Personal Number" />
        </div>

        <div class="input-group">
        <label>Language:</label>
        <div class="select-wrapper">
          <select v-model="language" required>
            <option disabled value="">Select language</option>
            <option
              v-for="lang in languages"
              :key="lang.code"
              :value="lang.code">
              {{ lang.label }}
            </option>
          </select>
        </div>
      </div>


        <div class="input-group">
          <label>Password:</label>
          <input v-model="password" type="password" placeholder="Enter Password" />
        </div>

        <button type="submit" class="btn-submit">Register</button>

        <p class="login-text">
          Already have an account?
          <router-link to="/login">Log in</router-link>
        </p>

      </form>
    </div>
  </div>
</template>

<script>
import { Api } from "../Api";

export default {
  name: "RegisterPage",

  data() {
  return {
    userId: "",
    personalNumber: "",
    language: "",
    password: "",
    error: "",
    languages: [
      { label: "Swedish", code: "swe" },
      { label: "English", code: "eng" },
      { label: "Arabic", code: "ara" },
      { label: "Spanish", code: "spa" },
      { label: "French", code: "fra" },
      { label: "German", code: "deu" },
      { label: "Italian", code: "ita" },
      { label: "Portuguese", code: "por" },
      { label: "Russian", code: "rus" },
      { label: "Chinese (Mandarin)", code: "zho" },
      { label: "Japanese", code: "jpn" },
      { label: "Korean", code: "kor" },
      { label: "Hindi", code: "hin" },
      { label: "Turkish", code: "tur" },
      { label: "Persian", code: "fas" },
      { label: "Somali", code: "som" }
    ]
  };
},

  methods: {
    async handleRegister() {
      try {
        await Api.post("/users/register", {
          userId: this.userId,
          personalNumber: this.personalNumber,
          language: this.language,
          password: this.password
        });

        this.$router.push("/login");
      } catch (err) {
        console.log(err.response?.data);

        const { message } = err.response.data;
        this.error = message;
        alert(this.error);
      }
    }
  }
};
</script>
<style scoped>@import "../styles/RegisterPage.css";</style>
