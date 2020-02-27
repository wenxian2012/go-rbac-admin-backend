const state = {
  siderCollapsed: false
};

const actions = {
};

const mutations = {
  toggleCollapse(state) {
    state.siderCollapsed = !state.siderCollapsed;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
