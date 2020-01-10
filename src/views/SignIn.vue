<template>
  <div>
    <h1>Sign In</h1>
    <div class="signin-form">
      <div class="isSignedIn">
        <label>Is SignedIn:</label>
        <span>{{isSignedIn}}</span>
      </div>
      <div class="signin">
        <label>E-mail</label>
        <input v-model="signInUser.email" />
      </div>
      <div class="password">
        <label>Password</label>
        <input v-model="signInUser.password" />
      </div>
      <button @click="signin">Confirm</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { SecurityModule, UserModule } from '@/store/modules';
import { UnregUser, SignInUser } from '@/store/types';

@Component
export default class SignIn extends Vue {
  private securityModule: SecurityModule = getModule(
    SecurityModule,
    this.$store,
  );

  private userModule: UserModule = getModule(UserModule, this.$store);

  private signInUser: SignInUser = {
    email: 'aka47Hitman@mail.ru',
    password: 'bbbb',
  };

  private async signin() {
    await this.securityModule.signin(this.signInUser);
    const path: any = this.$route.query.redirect && this.$route.query.redirect !== '/signin'
      ? this.$route.query.redirect
      : '/';
    this.$router.push({ path });
  }

  get isSignedIn(): string {
    return this.securityModule.isSignedIn ? 'YES' : 'NO';
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
