<template>
  <div class="login-wrapper">
    <div class="container">
      <div class="row min-vh-100 justify-content-center align-items-center">
        <div class="col-12 col-md-6">
          <div class="login-card">

            <h2 class="title">Sign up</h2>

            <b-form @submit.prevent="handleRegister">

              <b-form-group label="Username">
                <b-form-input
                  v-model="userId"
                  type="text"
                  placeholder="Enter Username"
                  required autocomplete="username"
                />
              </b-form-group>

              <b-form-group label="Personal Number">
                <b-form-input
                  v-model="personalNumber"
                  type="text"
                  placeholder="Enter Personal Number"
                  required auto
                />
              </b-form-group>

              <b-form-group label="Language">
                <b-form-select v-model="language" required>
                  <b-form-select-option disabled value="">
                    Select language
                  </b-form-select-option>

                  <b-form-select-option
                    v-for="lang in languages"
                    :key="lang.code"
                    :value="lang.code"
                  >
                    {{ lang.label }}
                  </b-form-select-option>
                </b-form-select>
              </b-form-group>

              <b-form-group label="Password">
                <b-form-input
                  v-model="password"
                  type="password"
                  placeholder="Enter Password"
                  required
                />
              </b-form-group>

              <b-button type="submit" variant="light" class="Register-btn">
                Register
              </b-button>

              <b-alert v-if="error" show class="mt-3">
                {{ error }}
              </b-alert>

              <p class="login-text mt-3">
                Already have an account?
                <router-link to="/login">Log in</router-link>
              </p>

            </b-form>

          </div>
        </div>
      </div>
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
<style scoped>@import "../style/RegisterPage.css";</style>
