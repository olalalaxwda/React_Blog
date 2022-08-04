import { makeAutoObservable } from "mobx"
import { http } from "@/utils"
class ChannelStore{
    channelList = []
    constructor(){
        makeAutoObservable(this)
    }
    //article和publish的时候要用，所以我们找到他俩的公共父组件，去Layout里面触发
    //这样就不用article和publish两个子模块都去发送一次请求频道列表数据了
    loadChannelList = async ()=>{
        const res = await http.get('/channels')
        this.channelList = res.data.data.channels
        // console.log(res.data.data.channels)
    }
}
export default ChannelStore