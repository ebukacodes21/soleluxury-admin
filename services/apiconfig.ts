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

    getCategory: `${main}/get-category`,
    getCategories: `${main}/get-categories`,
    createCategory: `${main}/create-category`,
    updateCategory: `${main}/update-category`,
    deleteCategory: `${main}/delete-category`,

    getSize: `${main}/get-size`,
    getSizes: `${main}/get-sizes`,
    createSize: `${main}/create-size`,
    updateSize: `${main}/update-size`,
    deleteSize: `${main}/delete-size`,

    getColor: `${main}/get-color`,
    getColors: `${main}/get-colors`,
    createColor: `${main}/create-color`,
    updateColor: `${main}/update-color`,
    deleteColor: `${main}/delete-color`,

    getProduct: `${main}/get-product`,
    getProducts: `${main}/get-products`,
    createProduct: `${main}/create-product`,
    updateProduct: `${main}/update-product`,
    deleteProduct: `${main}/delete-product`,

    getOrder: `${main}/get-order`,
    getOrders: `${main}/get-orders`,
    createOrder: `${main}/create-order`,
    updateOrder: `${main}/update-order`,
    deleteOrder: `${main}/delete-order`,
}

export default apiConfig