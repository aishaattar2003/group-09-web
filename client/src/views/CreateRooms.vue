<template>
  <div class="page-container">
    <div class="card">

        <div class="topBar">
        <button class="backButton" @click="$router.push('/admin')">
          ← Back
        </button>
      </div>

      <h1 class="title">Create Topic Room</h1>

      <!-- Room Type -->
      <div class="input-group">
        <label>Room Type</label>
        <select v-model="branchingRoomType" class="field">
          <option disabled value="">Select room type</option>
          <option
            v-for="type in roomTypes"
            :key="type"
            :value="type">
            {{ type }}
          </option>
        </select>
      </div>

      <!-- Room Topic -->
      <div class="input-group">
        <label>Room Topic</label>
        <select v-model="roomTopic" class="field">
          <option disabled value="">Select topic</option>
          <option
            v-for="topic in roomTopics"
            :key="topic"
            :value="topic">
            {{ topic }}
          </option>
        </select>
      </div>

      <!-- Room ID -->
      <div class="input-group">
        <label>Room ID</label>
        <input
          v-model="branchingRoomId"
          class="field"
          placeholder="Enter room ID"
        />
      </div>

      <!-- Button -->
      <button
        class="btn-submit"
        @click="handleCreateRoom">
        Create Room
      </button>

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

<style scoped>@import "../styles/CreateRooms.css";</style>
