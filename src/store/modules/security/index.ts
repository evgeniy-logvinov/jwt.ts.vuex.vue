import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';
import apiCall from '@/api';
import ApiSecurity from '@/api/ApiSecurity';
import { AuthStatus, UnregUser, SignInUser, SignInInfo, AuthStatuses } from './types';
import router from '@/router';

@Module({ namespaced: true, name: 'security' })
export class SecurityModule extends VuexModule {

    public token: string = '';
    public tokenExpiredIn: string = '';
    public tokenExpiredLife: string = '';

    public refreshExpiredIn: string = '';
    public refreshExpiredLife: string = '';

    public refreshToken: string = '';
    public status: AuthStatus = 'none';
    public hasLoadedOnce: boolean = false;
    private tokenInterval: number = 0;
    private refreshTokenInterval: number = 0;

    @Action
    public async signup({
        email,
        password,
        confirmPassword,
        emailPreferences,
        phone,
        name,
    }: UnregUser): Promise<string | void> {
        try {
            const { id }: { id: string } = await apiCall({
                requestApi: ApiSecurity.signup,
                data: { email, password, confirmPassword, emailPreferences, phone, name },
            });
            return id;
        } catch (err) {
            this.handleWebError(err);
        }
    }

    @Action
    public async signupActivated(id: string) {
        try {
            await apiCall({
                requestApi: ApiSecurity.signupActivate,
                requestParams: { id },
            });
        } catch (err) {
            this.handleWebError(err);
        }
    }

    @Action
    public async signin({ email, password }: SignInUser) {
        this.AUTH_REQUESTED();
        try {
            const signInInfo: SignInInfo = await apiCall({
                requestApi: ApiSecurity.signin,
                data: { email, password },
            });
            this.AUTH_SUCCESS(signInInfo);
            this.setTokens(signInInfo);
            this.context.dispatch('user/loadMy', null, { root: true });
        } catch (err) {
            this.AUTH_ERROR();
            this.removeTokens();
            this.handleWebError(err);
        }
    }

    @Action
    public async handleWebError(err: any) {
        if (err.response.status === 401 && router.currentRoute.path !== '/signin') {
            this.removeTokens();
            this.AUTH_SIGNOUT();
            router.push('/signin');
        }
        alert(err.message);
    }

    @Action
    public async signout() {
        try {
            await apiCall({
                requestApi: ApiSecurity.signout,
                data: { refreshToken: localStorage.getItem('refreshToken') },
            });
            this.removeTokens();
            this.AUTH_SIGNOUT();
            router.push('/signin');
        } catch (err) {
            this.handleWebError(err);
        }
    }

    @Action
    public async getToken() {
        try {
            const { token }: { token: string } = await apiCall({
                requestApi: ApiSecurity.token,
                options: {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'x-refresh-token': localStorage.getItem('refreshToken'),
                    },
                },
            });
            localStorage.setItem('token', token);
        } catch (err) {
            this.handleWebError(err);
        }
    }

    @Action
    public async getRefreshToken() {
        try {
            this.AUTH_REQUESTED();
            const signInInfo: SignInInfo = await apiCall({
                requestApi: ApiSecurity.refresh,
                options: {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'x-refresh-token': localStorage.getItem('refreshToken'),
                    },
                },
            });
            this.AUTH_SUCCESS(signInInfo);
            this.setTokens(signInInfo);
        } catch (err) {
            this.AUTH_ERROR();
            this.removeTokens();
            this.handleWebError(err);
        }
    }

    @Action
    public async checkTokenTime(): Promise<void> {
        this.SET_TOKEN_INTERVAL(setInterval(async () => {
            if (localStorage.getItem('token')) {
                const currentDateTime = new Date().getTime();
                const tokenDateTime = new Date(this.tokenExpiredIn).getTime();
                const dateDiff = tokenDateTime - currentDateTime;

                if (dateDiff < 3000 && dateDiff > 0) {
                    await this.getToken();
                }
            }
        }, 3000));
    }

    @Action
    public async checkRefreshTokenTime(): Promise<void> {
        this.SET_REFRESH_TOKEN_INTERVAL(setInterval(async () => {
            if (localStorage.getItem('refreshToken')) {
                const currentDateTime = new Date().getTime();
                const refreshTokenDateTime = new Date(this.refreshExpiredIn).getTime();
                const dateDiff = refreshTokenDateTime - currentDateTime;

                if (dateDiff < 0) {
                    this.removeTokens();
                }

                if (dateDiff < 30000 && dateDiff > 0) {
                    await this.getRefreshToken();
                }
            }
        }, 15000));
    }

    @Action
    public async clearTokenInterval(): Promise<void> {
        clearInterval(this.tokenInterval);
    }

    @Action
    public async clearRefreshTokenInterval(): Promise<void> {
        clearInterval(this.refreshTokenInterval);
    }

    @Action
    public async fillInfoFromStore(): Promise<void> {
        if (localStorage.getItem('refreshToken')) {
            this.setRefreshToken(localStorage.getItem('refreshToken') || '');
            await this.getRefreshToken();
        }
    }

    @Mutation
    private removeTokens() {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiredIn');
        localStorage.removeItem('tokenExpiredLife');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('refreshExpiredIn');
        localStorage.removeItem('refreshExpiredLife');
    }

    @Mutation
    private setRefreshToken(refreshToken: string) {
        this.refreshToken = refreshToken;
    }

    @Mutation
    private setTokens(signInInfo: SignInInfo) {
        localStorage.setItem('token', signInInfo.token);
        localStorage.setItem('tokenExpiredIn', signInInfo.tokenExpiredIn);
        localStorage.setItem('tokenExpiredLife', signInInfo.tokenExpiredLife);
        localStorage.setItem('refreshToken', signInInfo.refreshToken);
        localStorage.setItem('refreshExpiredIn', signInInfo.refreshExpiredIn);
        localStorage.setItem('refreshExpiredLife', signInInfo.refreshExpiredLife);
    }

    @Mutation
    private AUTH_REQUESTED() {
        this.status = AuthStatuses.AUTH_REQUESTED;
    }

    @Mutation
    private AUTH_SUCCESS({
        token,
        tokenExpiredIn,
        tokenExpiredLife,
        refreshToken,
        refreshExpiredIn,
        refreshExpiredLife,
    }: SignInInfo) {
        this.status = AuthStatuses.AUTH_SUCCESS;
        this.token = token;
        this.refreshToken = refreshToken;
        this.refreshExpiredIn = refreshExpiredIn;
        this.refreshExpiredLife = refreshExpiredLife;
        this.tokenExpiredIn = tokenExpiredIn;
        this.tokenExpiredLife = tokenExpiredLife;
        this.hasLoadedOnce = true;
    }

    @Mutation
    private AUTH_ERROR() {
        this.status = AuthStatuses.AUTH_ERROR;
        this.hasLoadedOnce = true;
    }

    @Mutation
    private AUTH_SIGNOUT() {
        this.status = AuthStatuses.NONE;
        this.token = '';
        this.refreshExpiredIn = '';
        this.tokenExpiredLife = '';
        this.tokenExpiredIn = '';
        this.tokenExpiredLife = '';
    }

    @Mutation
    private SET_TOKEN_INTERVAL(interval: number) {
        this.tokenInterval = interval;
    }

    @Mutation
    private SET_REFRESH_TOKEN_INTERVAL(interval: number) {
        this.refreshTokenInterval = interval;
    }

    get isSignedIn(): boolean {
        return !!this.token;
    }
}
