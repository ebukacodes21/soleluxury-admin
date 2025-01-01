const server = "http://localhost:8002"

const main = `${server}/api`

const apiConfig = {
    login: `${main}/login-user`,
    logout: `${main}/logout-user`,
    
    createStore: `${main}/create-store`,
    getStore: `${main}/get-store`,
    getFirstStore: `${main}/get-first-store`,
    getStores: `${main}/get-stores`,
    updateStore: `${main}/update-store`,
    deleteStore: `${main}/delete-store`,

    getBillboard: `${main}/get-billboard`,
    getBillboards: `${main}/get-billboards`,
    deleteBillboard: `${main}/delete-billboard`,
    updateBillboard: `${main}/update-billboard`,
    createBillboard: `${main}/create-billboard`,
}

export default apiConfig