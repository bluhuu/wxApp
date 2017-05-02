import ServiceBase from 'ServiceBase'

class Service extends ServiceBase {
	constructor() {
		super()
		this.$$prefix = ''
		this.$$path = {
			wechatSignUp: '/user/wechat/sign/up',
			wechatSignIn: '/user/wechat/sign/in',
			decryptData : '/user/wechat/decrypt/data',
			signIn      : '/mCenterAction/webLogin.do',
			signOut     : '/user/sign/out',
			classify    : '/classify',
			goods       : '/goods',
			members     : '/mMemberAction/query.do',
			search      : '/goods/search/all',
			cart        : '/mPurchaseAction/addCart.do',
            getCart     : '/mPurchaseAction/query.do',
			deleteCart  : '/mPurchaseAction/deleteCart.do',
            submitOrder : '/mPurchaseAction/submitOrder.do',
			address     : '/address',
			order       : '/order',
			sendMsg     : '/mSmsAction/sendMsg.do',
            editInfo    : '/mMemberAction/editInfo.do',
        }
	}

	wechatSignUp(params) {
		return this.postRequest(this.$$path.wechatSignUp, params)
	}

	wechatSignIn(params) {
		return this.postRequest(this.$$path.wechatSignIn, params)
	}

    submitOrder(params){
        return this.getRequest(this.$$path.submitOrder, params)
    }

	wechatDecryptData(params) {
		return this.postRequest(this.$$path.decryptData, params)
	}

	signIn(params) {
		return this.getRequest(this.$$path.signIn, params)
	}

	signOut() {
		return this.postRequest(this.$$path.signOut)
	}

	search(params) {
		return this.getRequest(this.$$path.search, params)
	}

	getGoods(params) {
		return this.getRequest(this.$$path.goods, params)
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

	getClassify(params) {
		return this.getRequest(this.$$path.classify, params)
	}

	getDetail(id) {
		return this.getRequest(`${this.$$path.goods}/${id}`)
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

	getAddressList(params) {
		return this.getRequest(this.$$path.address, params)
	}

	getAddressDetail(id) {
		return this.getRequest(`${this.$$path.address}/${id}`)
	}

	postAddress(params) {
		return this.postRequest(this.$$path.address, params)
	}

	putAddress(id, params) {
		return this.putRequest(`${this.$$path.address}/${id}`, params)
	}

	deleteAddress(id, params) {
		return this.deleteRequest(`${this.$$path.address}/${id}`)
	}

	getDefalutAddress() {
		return this.getRequest(`${this.$$path.address}/default`)
	}

	setDefalutAddress(id) {
		return this.postRequest(`${this.$$path.address}/default/${id}`)
	}

	getOrderList(params) {
		return this.getRequest(this.$$path.order, params)
	}

	getOrderDetail(id) {
		return this.getRequest(`${this.$$path.order}/${id}`)
	}

	postOrder(params) {
		return this.postRequest(this.$$path.order, params)
	}

	putOrder(id, params) {
		return this.putRequest(`${this.$$path.order}/${id}`, params)
	}

	deleteOrder(id, params) {
		return this.deleteRequest(`${this.$$path.order}/${id}`)
	}
}

export default Service
