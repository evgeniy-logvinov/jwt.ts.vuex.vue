export default {
    signup: { method: 'POST', url: 'security/signup' },
    signupActivate: { method: 'GET', url: ({ id }: { id: string }) => `security/signup/activate/${id}` },
    signin: { method: 'POST', url: 'security/signin' },
    signout: { method: 'POST', url: 'security/signout' },
    token: { method: 'GET', url: 'security/token' },
    refresh: { method: 'POST', url: 'security/refresh' },
};
