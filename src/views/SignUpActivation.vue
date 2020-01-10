<template>
  <div class="signup-activate">
    <h1>Please activate your account</h1>
    <div class="signup-activation-form">
      <button @click="signupActivate">Activate</button>
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

  private async signupActivate() {
    const id: string = this.$route.params.id;
    await this.securityModule.signupActivated(id);
    this.$router.push('/');
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>