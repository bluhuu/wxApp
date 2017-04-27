const App = getApp()
Page({
    data: {
        msg: {
            title: "",
            content: ""
        }
    },
    onLoad() {},
    messageAction(e){
        console.log(e);
    }
})
