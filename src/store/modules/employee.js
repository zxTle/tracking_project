const state = {
    employeeName: ""
}
const getters = {}
const actions = {}
const mutations = {
    setName(state, name) {
        state.employeeName = name
    },
    clearName(state, name) {
        state.employeeName = ""
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}