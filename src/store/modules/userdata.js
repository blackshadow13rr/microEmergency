export default {
    namespace: true,
    state: {
        username: "",
        oldpassword: "",
    },
    getters: {

    },
    mutations: {
        getUsername(state, username) {
            state.username = username
        },
        getPassword(state, password) {
            state.oldpassword = password
        }
    },
    actions: {
        handleGetUsername(context, username) {
            context.commit('getUsername', username)
        },
        handleGetPassword(context, password) {
            context.commit('getPassword', password)
        },
    },
    modules: {}
}