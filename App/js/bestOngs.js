import { logout, renderPagination, renderAlert, showUserData, renderBestOngs } from "./module.js"
import { requestBestOngs, requestLikeProfile } from "./request.js"

const btnLogout = document.querySelector("#logout")

document.addEventListener('DOMContentLoaded', async () => {
    const id = await showUserData()

    async function loadPage(page){
        const response = await requestBestOngs(id,page)
        const currentPage = response.data.page
        const totalPage = response.data.total_pages
        const profiles = response.data.profiles

        if(response.status == "success"){
            renderBestOngs(profiles)
            renderPagination(totalPage,currentPage,loadPage)
            const btnsLike = document.querySelectorAll("#btnLike")
            let body = {
                action:"",
                idUser: id
            }
            btnsLike.forEach((item,index)=>{
                if(profiles[index].curtido){
                    item.style.border = "1px solid red"
                }else{
                    item.style.border = "none"
                }

                item.addEventListener('click', async ()=>{
                    if(!profiles[index].curtido){
                        body.action = "increment"
                        item.style.border = "1px solid red"
                    }else{
                        body.action = "decrement"
                        item.style.border = "none"
                    }
                    body = JSON.stringify(body)
                    const responseLikeProfile = await requestLikeProfile(profiles[index].id,body)
                    console.log(responseLikeProfile)
                    loadPage(page)
                })
            })
        }
    }

    loadPage(1)
})

btnLogout.addEventListener('click', async ()=>{
    await logout()
})