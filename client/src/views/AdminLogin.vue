<template>
    <div class="login-wrapper">
      <div class="login-card">

        <!-- Header -->
        <h2 class="title">Admin Login</h2>  
        <form @submit.prevent="handleLogin" class="form">

            <!-- Dynamic Input -->
            <div class="input-group">
            <label>User ID</label>
            <input v-model="loginInput" type="text" required/>
            </div>
  
          <div class="input-group">
            <label>Password</label>
            <input v-model="password" type="password" required />
          </div>
  
          <button type="submit" class="login-btn">Login</button>
        </form>

        <!-- Error handling -->
        <p v-if="error" class="error">{{ error }}</p>
  
      </div>
    </div>
  </template>
  
  <script>
  import { Api } from "../Api";
    import { getUserObjectId, setUserObjectId } from "@/cache/user.cache";
  
  export default {
    name: "AdminLogin",
  
    data() {
      return {
        loginMethod: "userId", 
        loginInput: "",
        password: "",
        error: "",
      };
    },
  
    methods: {
      async handleLogin() {
      this.error = "";

      try {
        const payload = {
          password: this.password,
        };

        if (this.loginMethod === "userId") {
          payload.userId = this.loginInput;
        }

        const response = await Api.post("/users/login", payload);

        setUserObjectId(response.data.ObjectId);
        localStorage.setItem("user", JSON.stringify(response.data));

        this.$router.push("/main");
      } catch (err) {
        this.error = err.response?.data?.message || "Login failed";
      }
      },
    },
  };
  </script>
  <style scoped>@import "../styles/AdminLogin.css";</style>
