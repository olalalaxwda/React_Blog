import { makeAutoObservable } from "mobx"
import { http } from "@/utils"

class UserStore {
    userInfo={}
    constructor(){
        makeAutoObservable(this)       
    }
    async getUserInfo(){
        const res = await http.get('/user/profile')
        this.userInfo = res.data.data.name
        console.log(res.data.data.name)
        window.localStorage.setItem('name', res.data.data.name)
    }
}
export default UserStore