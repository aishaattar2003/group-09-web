<template>
  <div class="page-container">
    <div class="container">
      <div class="row justify-content-md-center">
      <div class="col-12 col-md-6">
    <div class="card">
        <div class="topBar">
        <b-button class="backButton" @click="$router.push('/admin')">
          ← Back
        </b-button>
      </div>

      <h1 class="title">Create Topic Room</h1>

        <b-form @submit.prevent="handleCreateRoom">

        <!-- Room Type -->
        <b-form-group label="Room Type">
          <b-form-select v-model="branchingRoomType" required>            
            <b-form-select-option disabled value="">Select room type</b-form-select-option>

            <b-form-select-option
              v-for="type in roomTypes"
              :key="type"
              :value="type">
              {{ type }}
            </b-form-select-option>
          </b-form-select>
        </b-form-group>

        <!-- Room Topic -->
        <b-form-group label="Room Topic">
          <b-form-select v-model="roomTopic" required>
            <b-form-select-option disabled value="">Select topic</b-form-select-option>

            <b-form-select-option
              v-for="topic in roomTopics"
              :key="topic"
              :value="topic">
              {{ topic }}
            </b-form-select-option>
          </b-form-select>
        </b-form-group>

      <!-- Room ID -->
        <b-form-group label="Room ID">
          <b-form-input
            v-model="branchingRoomId"
            placeholder="Enter room ID"
            required
          />
        </b-form-group>

      <!-- Button -->
      <b-button type="submit" class="btn-submit">
          Create Room
        </b-button>
    
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
  name: "CreateRooms",

  data() {
    return {
      branchingRoomId: "",
      branchingRoomType: "",
      roomTopic: "",
      error: "",

      roomTypes: ["LocalRoom", "GlobalRoom"],

      roomTopics: [
        "General",
        "Scandle",
        "Relationships",
        "Travel",
        "Movies",
        "Books",
        "Sports",
        "Food",
        "School"
      ]
    };
  },

  methods: {
    async handleCreateRoom() {
      try {
        if (!this.branchingRoomId || !this.branchingRoomType || !this.roomTopic) {
          alert("Please fill in all fields");
          return;
        }

        await Api.post("/branchingRooms", {
          branchingRoomId: this.branchingRoomId,
          branchingRoomType: this.branchingRoomType,
          roomTopic: this.roomTopic
        });

        alert("Branching room created successfully!");
        this.$router.push("/admin");
      } catch (err) {
        alert(err);
      }
    }
  }
};
</script>

<style scoped>@import "../style/CreateRooms.css";</style>