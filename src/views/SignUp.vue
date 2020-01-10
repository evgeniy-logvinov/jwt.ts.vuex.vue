<template>
  <div class="signup">
    <h1>Sign Up</h1>
    <div class="signup-form">
      <div class="first-name">
        <label>First name</label>
        <input v-model="unregUser.name.first" />
      </div>
      <div class="last-name">
        <label>Last name</label>
        <input v-model="unregUser.name.last" />
      </div>
      <div class="signup">
        <label>E-mail</label>
        <input v-model="unregUser.email" />
      </div>
      <div class="password">
        <label>Password</label>
        <input type="password" v-model="unregUser.password" />
      </div>
      <div class="confirm-password">
        <label>Confirm Password</label>
        <input type="password" v-model="unregUser.confirmPassword" />
      </div>
      <div class="phone">
        <label>Phone</label>
        <input v-model="unregUser.phone" />
      </div>
      <div class="email-preferences">
        <label>Email preferences</label>
        <input type="checkbox" v-model="unregUser.emailPreferences" />
      </div>
      <button @click="signup">Confirm</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { SecurityModule, UserModule } from '@/store/modules';
import { UnregUser, SignInUser } from '@/store/types';

@Component
export default class SignUp extends Vue {
  private securityModule: SecurityModule = getModule(
    SecurityModule,
    this.$store,
  );

  private unregUser: UnregUser = {
    email: 'aka47Hitman@mail.ru',
    password: 'bbbb',
    confirmPassword: 'bbbb',
    emailPreferences: true,
    phone: 'aasdasd',
    name: { first: 'First', last: 'Last' },
  };

  private async signup() {
    await this.securityModule.signup(this.unregUser);
  }

  get isSignedIn(): string {
    return this.securityModule.isSignedIn ? 'YES' : 'NO';
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.signup-form {
  width: 30%;
  border: 1px solid;
  text-align: center;
}
</style>