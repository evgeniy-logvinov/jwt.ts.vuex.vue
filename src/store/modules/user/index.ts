import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';
import apiCall from '@/api';
import ApiUser from '@/api/ApiUser';
import { User, Session } from './types';

@Module({ namespaced: true, name: 'user' })
export class UserModule extends VuexModule {

    public user: User = {
        id: '',
        password: '',
        email: '',
        isAdmin: false,
        emailPreferences: false,
        activated: false,
        name: { first: '', last: '' },
    };

    public sessions: Session[] = [];

    @Action
    public async loadMy(): Promise<void> {
        try {
            const user: User = await apiCall({
                requestApi: ApiUser.user,
            });
            this.SET_USER(user);
        } catch (err) {
            this.handleWebError(err);
        }
    }

    @Action
    public async loadSessions(): Promise<void> {
        try {
            const sessions: Session[] = await apiCall({
                requestApi: ApiUser.sessions,
            });
            this.SET_SESSIONS(sessions);
        } catch (err) {
            this.handleWebError(err);
        }
    }

    @Action
    public async deleteAllSessions(): Promise<void> {
        try {
            await apiCall({
                requestApi: ApiUser.deleteAllSessions,
                data: { refreshToken: localStorage.getItem('refreshToken') },
            });
        } catch (err) {
            this.handleWebError(err);
        }
    }

    @Action
    public async deleteByIdSession({ id }: { id: string }): Promise<void> {
        try {
            await apiCall({
                requestApi: ApiUser.deleteByIdSession,
                data: { refreshToken: localStorage.getItem('refreshToken') },
                requestParams: { id },
            });
        } catch (err) {
            this.handleWebError(err);
        }
    }

    @Action
    public handleWebError(err: any) {
        this.context.dispatch('security/handleWebError', err, { root: true });
    }

    @Mutation
    private SET_USER(user: User): void {
        this.user = user;
    }

    @Mutation
    private SET_SESSIONS(sessions: Session[]): void {
        this.sessions = sessions;
    }
}
