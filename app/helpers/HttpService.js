import ServiceBase from 'ServiceBase'

class Service extends ServiceBase {
    constructor() {
        super()
        this.$$prefix = ''
        this.$$path = {
            signIn      : '/mCenterAction/webLogin.do',
            members     : '/mMemberAction/query.do',
            cart        : '/mPurchaseAction/addCart.do',
            getCart     : '/mPurchaseAction/query.do',
            deleteCart  : '/mPurchaseAction/deleteCart.do',
            submitOrder : '/mPurchaseAction/submitOrder.do',
            sendMsg     : '/mSmsAction/sendMsg.do',
            editInfo    : '/mMemberAction/editInfo.do',
        }
    }

    submitOrder(params){
        return this.getRequest(this.$$path.submitOrder, params)
    }

    signIn(params) {
        return this.getRequest(this.$$path.signIn, params)
    }

    getMembers(params) {
        return this.getRequest(this.$$path.members, params)
    }

    getTelAuthenticode (params) {
        return this.getRequest(this.$$path.sendMsg, params)
    }

    setUserInfo(params) {
        return this.getRequest(this.$$path.editInfo, params)
    }

    getCart(params) {
        return this.getRequest(this.$$path.getCart,params)
    }

    addCart(params) {
        return this.getRequest(this.$$path.cart,params)
    }

    deleteCart(params) {
        return this.getRequest(this.$$path.deleteCart,params)
    }

    putCartByUser(id, params) {
        return this.putRequest(`${this.$$path.cart}/${id}`, params)
    }

    delCartByUser(id) {
        return this.deleteRequest(`${this.$$path.cart}/${id}`)
    }

    clearCartByUser() {
        return this.postRequest(`${this.$$path.cart}/clear`)
    }
}

export default Service
