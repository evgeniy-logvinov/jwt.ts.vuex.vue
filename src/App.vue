<template>
  <div id="app">
    <div class="signin-links" v-if="!isSignedIn">
      <router-link to="/signin">SignIn</router-link>
      <router-link to="/signup">SignUp</router-link>
    </div>
    <div v-else>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <button @click="signout">SignOut</button>
    </div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { SecurityModule, UserModule } from '@/store/modules';
import { UnregUser, SignInUser, User } from '@/store/types';

@Component
export default class App extends Vue {
  private securityModule: SecurityModule = getModule(
    SecurityModule,
    this.$store,
  );

  private userModule: UserModule = getModule(
    UserModule,
    this.$store,
  );

  private async created() {
    await this.securityModule.fillInfoFromStore();
    if (this.securityModule.isSignedIn) {
      await this.userModule.loadMy();
    }
    await this.securityModule.checkTokenTime();
    await this.securityModule.checkRefreshTokenTime();
  }

  private beforeDestroy() {
    this.securityModule.clearTokenInterval();
    this.securityModule.clearRefreshTokenInterval();
  }

  private async signout() {
    await this.securityModule.signout();
  }

  get isSignedIn(): boolean {
    return this.securityModule.isSignedIn;
  }
}
</script>

<style lang="scss">
.signin-links {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
