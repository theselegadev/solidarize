import { logout, renderPagination, renderAlert, showUserData, renderBestOngs, handleVolunteer } from "./module.js"
import { requestBestOngs, requestLikeProfile } from "./request.js"

const btnLogout = document.querySelector("#logout")

document.addEventListener('DOMContentLoaded', async () => {
    const id = await showUserData()

    await handleVolunteer(id)

    async function loadPage(page){
        const response = await requestBestOngs(id,page)
        const currentPage = response.data.page
        const totalPage = response.data.total_pages
        const profiles = response.data.profiles

        if(response.status == "success"){
            renderBestOngs(profiles)
            renderPagination(totalPage,currentPage,loadPage)

            const btnsLike = document.querySelectorAll("#btnLike")
            const displaysLike = document.querySelectorAll("small")

            let body = {
                action:"",
                idUser: id
            }

            btnsLike.forEach((item,index)=>{
                let numberLikes = Number.parseInt(displaysLike[index].innerHTML)

                if(profiles[index].curtido){
                    item.style.border = "1px solid red"
                }else{
                    item.style.border = "none"
                }

                item.addEventListener('click', async ()=>{
                    if(!profiles[index].curtido){
                        body.action = "increment"
                        item.style.border = "1px solid red"
                        profiles[index].curtido = 1
                        numberLikes++
                    }else{
                        body.action = "decrement"
                        item.style.border = "none"
                        profiles[index].curtido = 0
                        numberLikes--
                    }

                    body = JSON.stringify(body)
                    await requestLikeProfile(profiles[index].id,body)
                    body = JSON.parse(body)

                    displaysLike[index].innerHTML = numberLikes
                })
            })
        }else{
            renderAlert(response.message)
        }
    }

    loadPage(1)
})

btnLogout.addEventListener('click', async ()=>{
    await logout()
})