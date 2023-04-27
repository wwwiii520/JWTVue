import { createStore } from 'vuex'
import { login, refreshToken } from '../api'

export default createStore({
    state: {
        // 存放状态
        goods: 123,
        accessToken: '',
        refreshToken: '',
        expiryTime: null,
        refreshExpiryTime: null
    },
    getters: {
        // state的计算属性
        goods: function (state) {
            return state.goods
        },
        accessToken: function (state) {
            return state.accessToken || localStorage.getItem('accessToken')
        },
        refreshToken: function (state) {
            return state.refreshToken || localStorage.getItem('refreshToken')
        },
        expiryTime: function (state) {
            return state.expiryTime || localStorage.getItem('expiryTime')
        },
        refreshExpiryTime: function (state) {
            return state.refreshExpiryTime || localStorage.getItem('refreshExpiryTime')
        }
    },
    mutations: {
        // 更改state中状态的逻辑，同步操作,浏览器刷新store值会丢失，所以存到localStorage | sessionStorage
        SET_ACESSTOKEN: (state, token) => {
            localStorage.setItem('accessToken', token)
            state.accessToken = token
        },
        SET_REFRESHTOKEN: (state, token) => {
            localStorage.setItem('refreshToken', token)
            state.refreshToken = token
        },
        SET_EXPIRYTIME: (state, expiryTime) => {
            localStorage.setItem('expiryTime', expiryTime)
            state.expiryTime = expiryTime
        },
        SET_REFRESHEXPIRYTIME: (state, refreshExpiryTime) => {
            localStorage.setItem('refreshExpiryTime', refreshExpiryTime)
            state.refreshExpiryTime = refreshExpiryTime
        }
    },
    actions: {
        // 提交mutation，异步操作
        // user login 登录
        login({ commit }, userInfo) {
            const { username, password } = userInfo
            return new Promise((resolve, reject) => {
                login({ username: username.trim(), password: password }).then(response => {
                    const { data } = response
                    commit('SET_ACESSTOKEN', data.accessToken)
                    commit('SET_REFRESHTOKEN', data.refreshToken)
                    commit('SET_EXPIRYTIME', data.expiryTime)
                    commit('SET_REFRESHEXPIRYTIME', data.refreshExpiryTime)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // user logout 
        logout({ commit, state, dispatch }) {
            commit('SET_ACESSTOKEN', '')
            commit('SET_REFRESHTOKEN', '')
        },
        // refresh token
        refreshToken({ commit }, data) {
            return new Promise((resolve, reject) => {
                // 为了测试多个请求挂起，不会丢失请求，设置延时
                // setTimeout(function () {
                    refreshToken(data.accessToken, data.refreshToken).then(response => {
                        const { data } = response
                        commit('SET_ACESSTOKEN', data.accessToken)
                        commit('SET_REFRESHTOKEN', data.refreshToken)
                        commit('SET_EXPIRYTIME', data.expiryTime)
                        commit('SET_REFRESHEXPIRYTIME', data.refreshExpiryTime)
                        resolve()
                    }).catch(error => {
                        reject(error)
                    })
                // }, 3000)
            })
        }
    },
    // 如果将store分成一个个的模块的话，则需要用到modules。
    // 然后在每一个module中写state, getters, mutations, actions等。
    modules: {
    }
})

