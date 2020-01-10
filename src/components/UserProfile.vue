<template>
  <div class="profile">
    <div class="user">User: {{userInfo.name.first}} {{userInfo.name.last}}</div>
    <div class="sessions">
      <span>Sessions:</span>
    </div>
    <div class="session" :key="session.id" v-for="session in sessions">
      <div>
        <span class="label">Last action:</span>
        {{session.lastActionAt}} {{session.userAgent}}
      </div>
      <div>
        <span class="label">IP:</span>
        {{session.ip}}
      </div>
      <div>
        <span class="label">User:</span>
        {{session.ip}}
      </div>
      <div>
        <button @click="dropSession(session.id)">Drop session</button>
      </div>
    </div>
    <div>
      <button @click="refreshSession">Refresh sessions</button>
    </div>
    <div>
      <button @click="dropAllOtherSessions">Drop All Other Sessions</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { UserModule, SecurityModule } from '@/store/modules';
import { User, Session } from '@/store/types';

@Component
export default class UserProfile extends Vue {

  private userModule: UserModule = getModule(UserModule, this.$store);
  private securityModule: SecurityModule = getModule(
    SecurityModule,
    this.$store,
  );

  private async created() {
    await this.userModule.loadSessions();
  }

  private async dropSession(id: string) {
    await this.userModule.deleteByIdSession({ id });
    await this.userModule.loadSessions();
  }

  private async dropAllOtherSessions() {
    await this.userModule.deleteAllSessions();
    await this.userModule.loadSessions();
  }

  private async refreshSession() {
    await this.userModule.loadSessions();
  }

  get userInfo(): User {
    return this.userModule.user;
  }

  get sessions(): Session[] {
    return this.userModule.sessions;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.profile {
  text-align: left;
}
.user {
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 800;
}
.sessions {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
}
.session {
  margin-bottom: 10px;
}
.label {
  font-weight: 600;
}
</style>
