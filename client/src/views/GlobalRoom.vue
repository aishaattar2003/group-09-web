<template>
    <div class="background-style" :class="{ light: isLight }">

        <!-- Head banner -->
        <div class="head-banner-wrapper row gx-3 d-flex  align-items-center justify-content-between px-2 px-md-3">

            <!-- Left logo -->
            <div class="logo-wrapper">
                <img class="logo-style border-0 bg-transparent" 
                src="@/assets/HMO_logo.png" 
                alt="App Logo" />
            </div>


        <!-- Localroom title and branching room type -->
            <div class="header-flex-box d-flex">
              <div class="room-tittle">
                <h1 class="header-title-style">GLOBAL ROOM</h1>
                <img
                    class="global-icon"
                    src="@/assets/Global_logo.png"
                    alt="Global Room"
                    />

                  </div>
                

                <div class="category-div-style d-flex column">
                    <h2 class="category-title-style">
                        {{ this.branchingRoomTopic}}
                    </h2>
                </div>
            </div>

            <!-- Menu button -->
            <div class="menu-button-flex">
                <button class="button-icon-style btn-sm" @click="openMenu">
                    <FontAwesomeIcon icon="list-ul" size="xl" style="color: aliceblue;" />
                </button>
            </div>
        </div>

        <!-- Side menu -->
        <div 
            class="side-menu-overlay" 
            v-if="isMenuOpen" 
            @click="closeMenu">
        </div>

        <div 
            class="side-menu-wrapper"
            :class="{ menuVisible: isMenuOpen }">

            <div class="side-menu-content">
                <button class="side-menu-button btn" @click="changeRoomTopic('General')">General</button>
                <button class="side-menu-button btn" @click="changeRoomTopic('Scandle')">Scandle</button>
                <button class="side-menu-button btn" @click="changeRoomTopic('Travel')">Travel</button>
                <button class="side-menu-button btn" @click="changeRoomTopic('Movies')">Movies</button>
                <button class="side-menu-button btn" @click="changeRoomTopic('Books')">Books</button>
                <button class="side-menu-button btn" @click="changeRoomTopic('Sports')">Sports</button>
                <button class="side-menu-button btn" @click="changeRoomTopic('Relationships')">Relationships</button>
                <button class="side-menu-button btn" @click="changeRoomTopic('Food')">Pets</button>
                <button class="side-menu-button btn" @click="changeRoomTopic('School')">Politics</button>
            </div>
        </div>


        <!-- Empty room -->
        <div class="room-box" ref="messageBox" @click="closeAllOptions">



            <!--Message-->
             <div
                v-for="msg in messages"
                :key="msg.messageId" 
                :ref="`msg-${msg.messageId}`"
                class="message-row-wrapper"
                :class="[String(msg.senderId) === String(this.senderObjectId) ? 'my-message':'others-message',
                    activeMessageOption === msg.messageId ? 'message-active' : ''
                ]">
                
                <div class="message-detail-wrapper">
                    <div
                    v-if="msg.ParentMessageId"
                    class="replyPreview"
                    @click="goToMessage(msg.ParentMessageId.MessageId)"
                    >
                    <div class="replyBar"></div>
                    <div class="replyContent">
                        <small class="replyLabel"><em>Replying to</em></small>
                        <p class="replyText">
                            {{ msg.ParentMessageId.Body }}
                        </p>
                    </div>
                </div>

                <small class="message-font-style">
                    {{ msg.anonymousName}}
                </small>

                <p class="message-text-style">
                    {{ msg.isTranslated ? msg.translatedBody : msg.Body }}
                </p>

                <small class="message-font-style">
                    {{ new Date(msg.timestamp).toLocaleDateString() }}
                </small>

                </div>

                <div
                  v-if="msg.reactions && msg.reactions.length"
                  class="messageReactions">
                  <span
                    v-for="(r, index) in msg.reactions"
                    :key="index"
                    class="reactionEmoji">
                    {{ r.reaction }}
                  </span>
                </div>

                <!--Option Button-->


                <div 
                    class="option-button-wrapper">
                    <button class="option-button-style btn-sm" @click.stop="openOptionMenu(msg.messageId)">•••</button>
                </div>
                
                <!-- Option Menu -->

                 <div 
                    class="option-menu-overlay "
                    v-if="activeMessageOption === msg.messageId"
                    @click.self="closeOptionMenu()">

                    <div class="option-menu-content" @click.stop>
                    <!-- Everyone can reply -->
                    <button class="option-menu-button btn-sm" @click="replyToMessage(msg)">Reply</button>
                    <!-- Everyone can react -->
                    <button class="option-menu-button btn-sm" @click="toggleReactionMenu(msg)">React</button>
                    <!-- only sender can edit -->
                    <button
                      v-if="String(msg.senderId) === String(senderObjectId)"
                      class="option-menu-button btn-sm"
                      @click="editMessage(msg)">Edit</button>
                    <!-- only sender can delete -->
                    <button
                      v-if="String(msg.senderId) === String(senderObjectId)"
                      class="option-menu-button btn-sm"
                      @click="deleteMessage(msg)">Delete</button>
                    <!-- only sender can delete -->
                    <button v-if="String(msg.senderId) !== String(senderObjectId)" 
                     class="optionMenuButton"
                      @click="translateMessage(msg)">Translate</button>
                </div>

                    <!-- Reaction Menu -->

                    <div
                        v-if="showReactionsForMessage === activeMessageOption"
                        class="reactionPicker">
                        <button
                            v-for="reaction in REACTIONS"
                            :key="reaction.type"
                            class="reactionButton"
                            @click="reactToMessage(this.activeMessageOption, reaction.emoji)">
                            {{ reaction.emoji }}
                        </button>
                    </div>
                </div>

            </div>

        </div>

        
       <!--Parent Message in case of responce-->   
        <div
         v-if="this.replyBannerActive"
         class ="parent-message-responce-layout d-flex column px-3 px-md-3"
         :class="[this.replyBannerActive ? 'show-parent-message': '']">

         <div class="parent-message-text-layout">
            <small><em>Replying to {{this.replyBannerActive }}</em></small>
            <p><strong>{{this.parentMessageContent }}</strong></p>

         </div>
         <button @click.self="DisableReplyBanner()" class="close-button-icon-style">x</button>


        </div>

        <div v-if="chatPaused" class="chatPaused">
          {{ chatPausedMessage }}
        </div>

        <!-- Footer and bottom banner -->
        <div class="message-box-flex d-flex justify-content-around">
            
            <b-avatar variant="success" icon="people-fill"></b-avatar>

            <div class="message-box-wrapper">
                <form class="input-container" @submit.prevent="sendMessage">
                    <input class ='message-box-style form-control 'type="text" v-model="message" :disabled="chatPaused" :placeholder="chatPaused ? 'Chat is paused' :    isEditing ? 'Editing message…' : 'Send a confession...'"/>
                        <button class="send-button-Inside" type="submit" :disabled="chatPaused">
                            <FontAwesomeIcon  icon="paper-plane" size="lg"style="color: #2b0d2b;"  />
                        </button>
                        <button v-if="isEditing" class="cancelbuttonInside" @click="cancelEdit">
                          <FontAwesomeIcon  icon="fa-solid fa-xmark" size="xl"style="color: #2b0d2b;" />
                        </button>
                        <button v-if="isEditing" class="cancelbuttonInside" @click="cancelEdit">
                          <FontAwesomeIcon  icon="fa-solid fa-xmark" size="xl"style="color: #2b0d2b;" />
                        </button>
                </form>
            </div>

            <div class="ThemeToggle ">
              <button class=" btn-sm btn-outline-light bg-transparent d-flex text-light border-0" @click="toggleTheme">
                <small>{{ isLight ? "🌙" : "☀" }}</small>
                <small class="d-none d-md-flex align-items-center gap-2">{{ isLight ? "Dark" : "Light" }}</small>
              </button>
            </div>

            <!-- Exit button -->
            <div class="exit-button-wrapper">
            <button class="button-icon-style btn-sm" @click="showSettings = true">
               <FontAwesomeIcon icon="arrow-right-from-bracket" size="xl"style="color: aliceblue;" />
                </button>
            </div>

        </div>

    </div>
    <SettingsPopup v-if="showSettings" @close="showSettings = false"/>
</template>



<script>
import { Api } from '@/Api';
import { socket } from '@/socket/client.socket';
import { getUserObjectId } from '@/cache/user.cache.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import SettingsPopup from "./SettingsPopup.vue";
import {followLink} from "../services/hateoas.service";

const REACTIONS = [
  { type: "like", emoji: "👍" },
  { type: "love", emoji: "❤️" },
  { type: "laugh", emoji: "😂" },
  { type: "sad", emoji: "😢" },
  { type: "angry", emoji: "😡" }
];

export default {
    name: 'globalroom',
    components: {
        FontAwesomeIcon,
        SettingsPopup
    },


  data() {
    return {
      message: '',
      isMenuOpen: false,
      branchingRoomTopic: 'General',
      branchingRoomId: '',
      messages: [],
      senderObjectId: getUserObjectId(),
      socket,
      chatListner: null,
      activeMessageOption: null,
      parentMessageId: '',
      parentMessageContent: '',
      showReactionsForMessage: null,
      REACTIONS,
      replyBannerActive: '',
      isLight: false,
      showSettings: false,
      selectedMessageId:'',
      chatPaused: false,
      chatPausedMessage: "",
      messageInput: "",
      isEditing: false,
      originalEditMessage: '',
      messageRelatedLinks:null,
      selectedMessageId: null,


      

    };
  },
 beforeUnmount(){
        if(this.socket && this.chatListner){
            this.socket.off("chat message", this.chatListner);
            this.socket.off("chat-frozen");
            this.socket.off("chat-unfrozen");
            this.socket.off("respond to a message", this.chatListner);
            
        }
    },

    async mounted(){
        await this.getAllBranhingRooms();

        if(!this.socket.connected){
            this.socket.connect();
        }

        this.chatListner = (msg)=>
            this.messages.push({
                messageId: msg.messageId,
                Body: msg.Body,
                timestamp: msg.SendTimestamp,
                ResponseIds: msg.ResponseIds || [],
                senderId: msg.Sender,
                ParentMessageId: msg.ParentMessageId?{
                    Body: msg.ParentMessageId.Body,
                    MessageId: msg.ParentMessageId.messageId,
                    messageObjectId: msg.ParentMessageId._id,
                }: null,
                messageObjectId: msg._id,
                anonymousName: msg.senderAnonymousName,
                reactions: msg.Reactions || [],
                _links :msg._links|| null,
            });
        this.$nextTick(()=>{
            this.scrollToBottom();
        });
        this.socket.on("chat message",this.chatListner);

         this.$nextTick(() => {
            this.scrollToBottom();
        });


        if (this.branchingRoomId && this.senderObjectId) {
          this.socket.emit("join room", {
            userId: this.senderObjectId,
            roomId: this.branchingRoomId,
          });
        }

        this.socket.on("chat status changed", (data) => {
        if (data.roomType !== "LocalRoom") 
          return;
        this.chatPaused = !data.live;
        this.chatPausedMessage = this.chatPaused ? "Chat is currently paused by admin" : "";});
        
        this.socket.on("chat paused", (data) => {
          this.chatPaused = true;
          this.chatPausedMessage = data.message;
        });
    },
    watch: {messages() {
      this.$nextTick(this.scrollToBottom);
    },
        branchingRoomId(newId, oldId) {
        if (!newId || !this.socket || !this.senderObjectId) return;

        this.socket.emit("join room", {
          userId: this.senderObjectId,
          roomId: newId,
        });

        this.fetchMessages().then(() => {
          this.$nextTick(() => this.scrollToBottom());
        });

        this.chatPaused = false;
        this.chatPausedMessage = "";
      },
    },
  methods: {
    DisableReplyBanner(){
        this.replyBannerActive ='';
    },
    closeAllOptions(){
        this.closeOptionMenu();
        this.closeMenu();


    },
    changeRoomTopic(newTopic) {
      this.branchingRoomTopic = String(newTopic);
      this.getAllBranhingRooms();
      this.closeMenu();
    },

    scrollToBottom() {
      const box = this.$refs.messageBox;
      if (box && box.lastElementChild) {
        box.lastElementChild.scrollIntoView({ behavior: 'smooth' });
      }
    },


    goToMessage(parentMessageId){
       this.$nextTick(()=>{
        const ref = this.$refs?.[`msg-${parentMessageId}`];
        const el = Array.isArray(ref)? ref[0]:ref;

        if(!el){
            console.warn("No Dom ref for mresage", parentMessageId);
            return;
        }
         el.scrollIntoView({
                behavior:"smooth"
            });
       });

    },

        openMenu() {
            this.isMenuOpen = true;
        },
        closeMenu() {
            this.isMenuOpen = false;
        },
      editMessage(msg){
          this.isEditing = true;
          this.selectedMessageId = msg.messageId;
          this.originalEditMessage = msg.Body; 
          this.message = msg.Body;
          this.closeOptionMenu();
        },
    openOptionMenu(messageId) {
      this.activeMessageOption = messageId;
      const msg = this.messages.find(m => m.messageId === messageId);
      this.messageRelatedLinks = msg?._links || null;
    },

    closeOptionMenu() {
      this.activeMessageOption = null;
      this.showReactionsForMessage = null;
      this.messageRelatedLinks = null;

    },


    ifParentMessage(msg){
        if(msg.ParentMessageId) return true;
    },

    async deleteMessage(msg){

      try{
        const deleteLink = msg?._links?.deleteMessage;
        if(!deleteLink){
          console.warn("No Delete Link on message");
          return;
        }
        await followLink(deleteLink);
        this.activeMessageOption = '';
        this.fetchMessages();
      }catch(err){
        console.err("Delete Failed", err);
      }


    },

    async replyToMessage(msg) {
      this.parentMessageId = msg.messageId;
      this.replyBannerActive = msg.messageId;
      this.parentMessageContent = msg.Body;
      this.closeOptionMenu();
    },

    async getAllBranhingRooms() {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await Api.get("/branchingrooms", {
        params: {
          roomTopic: this.branchingRoomTopic || "General",
          branchingRoomType: "GlobalRoom",
          language: user.language
        }
      });


      const room = res?.data?.Body?.[0];
      this.branchingRoomId = room ? room.branchingRoomId : '';
      if(!this.branchingRoomId){
        console.error('The branching room does not exist');
        return;
      }

      if (this.branchingRoomId) {
        await this.fetchMessages();
      }
    },

    async fetchMessages() {
      if(!this.branchingRoomId){
        console.error('The Branching room is not passed on', this.branchingRoomId)
      }
      const res = await Api.get(
        `/branchingrooms/${this.branchingRoomId}/messages`
      );


      this.messages = res.data.map(m => ({
        senderId: m?.Sender?._id || null,
        ParentMessageId: m.ParentMessageId ? {
            ParentMessageObjectId:m.ParentMessageId._id,
            Body:m.ParentMessageId.Body,
            MessageId: m.ParentMessageId.messageId,
        }: null,
        messageObjectId: m._id,
        ResponseIds: m.ResponseIds,
        messageId: m.messageId,
        anonymousName: m.anonymousName,
        Body: m.Body,
        originalBody: m.Body,   
        translatedBody: null,  
        isTranslated: false, 
        timestamp: m.SendTimestamp,
        reactions: m.Reactions || [],
        _links:m._links|| null,
      }));
    },

    async sendMessage() {
      if (!this.message.trim()) return;
        if (this.isEditing && this.selectedMessageId) {
          try {
            const msg = this.messages.find(m=> m.messageId === this.selectedMessageId);
            await followLink(msg._links.updateMessage, {Body:this.message});

            this.isEditing = false;
            this.selectedMessageId = null;
            this.message = '';
            this.replyBannerActive = '';
            this.parentMessageContent = '';
            
            await this.fetchMessages();
            return;
          } catch (err) {
            console.error("Failed to edit message:", err);
            return;
          }
        }
      const messageId = this.parentMessageId
        ? `responceMessageId${Math.floor(Math.random() * 100000)}`
        : `messageId${Math.floor(Math.random() * 100000)}`;

      const payload = {
        messageId,
        Body: this.message,
        SendTimestamp: new Date().toISOString(),
        Reaction: null,
        ResponseIds: [],
        Sender: this.senderObjectId,

      };

      if (this.parentMessageId) {
          const msg = this.messages.find(m=> m.messageId === this.parentMessageId);
          await followLink(msg._links.createResponse, payload);
        this.parentMessageId = '';
      } else {
          await Api.post(`/branchingrooms/${this.branchingRoomId}/messages/`, payload);
      }

      this.message = '';
      this.replyBannerActive='';
      this.parentMessageContent="";
    },

    toggleReactionMenu(msg) {
      this.showReactionsForMessage =
        this.showReactionsForMessage === msg.messageId ? null : msg.messageId;
    },

    async reactToMessage(messageId, reaction) {
        const originalMessage = await Api.get( `/branchingrooms/${this.branchingRoomId}/messages/${messageId}`);
        const reactionList = originalMessage.data.Reactions;

        const existingReaction = reactionList.find(
          r => r.userId === this.senderObjectId
        );
        if (existingReaction){
            throw new Error("Only one reaction is reaction")
            return;
        };

        const payload = {
            branchingRoomId: this.branchingRoomId, 
            messageId: messageId, 
            userId: this.senderObjectId,
            reaction: reaction
            
        }

        const msg = this.messages.find(m => m.messageId === messageId);

        const res = followLink(msg._links.reactToMessage, payload);

      if (msg) {
        msg.reactions = res?.data?.reactions || [];
      }

      this.closeOptionMenu();
    }, 

    toggleTheme() {
            this.isLight = !this.isLight;
        },

    cancelEdit() {
      this.isEditing = false;
      this.selectedMessageId = null;
      this.message = '';              
      this.originalEditMessage = ''; 
    },

    async translateMessage(msg) {
          try {
            if (msg.isTranslated) {
              msg.isTranslated = false;
              return;
            }
          
            // translate to user's UI language
            const user = JSON.parse(localStorage.getItem("user"));
            const targetLang = user?.language || "en";
          
            const res = await Api.get(
              `/branchingrooms/${this.branchingRoomId}/messages/${msg.messageId}/translate`,
              {
                params: { target: targetLang }
              }
            );
            
            if (res.data.failed) {
              console.warn("Translation failed, keeping original text");
              return;
            }
            
            msg.translatedBody = res.data.translated;
            msg.isTranslated = true;
            
            this.closeOptionMenu();
          } catch (err) {
            console.error("Translation failed:", err);
          }
        },
  }

}
</script>


<style scoped>@import "../styles/GlobalRoom.css";</style>
