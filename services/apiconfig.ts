const server = "http://localhost:8002"

const main = `${server}/api`

const apiConfig = {
    login: `${main}/login-user`,
    createStore: `${main}/create-store`,
    getStore: `${main}/get-store`,
    getFirstStore: `${main}/get-first-store`,
    getStores: `${main}/get-stores`,
}

export default apiConfig