export default {
    user: { method: 'GET', url: 'users/user' },
    sessions: { method: 'GET', url: 'users/sessions' },
    deleteAllSessions: { method: 'DELETE', url: 'users/sessions/delete-all' },
    deleteByIdSession: { method: 'DELETE', url: ({ id }: { id: string }) => `users/sessions/delete/${id}` },
};
