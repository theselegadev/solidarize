import { logout, renderAlert, renderPagination, renderProfiles, showUserData } from "./module.js";
import { requestGetNeedVolunteers, requestLikeProfile } from "./request.js";

const btnLogout = document.querySelector("#logout")

document.addEventListener("DOMContentLoaded", async ()=>{
    const id = await showUserData()

    async function loadPage(page){
        const response = await requestGetNeedVolunteers(id,page)
        const totalPages = response.data.total_pages
        const currentPage = response.data.page
        
        if(response.status == "success"){
            const profiles = response.data.profiles

            await renderProfiles(profiles)
            renderPagination(totalPages,currentPage, loadPage)

            const btnsLike = document.querySelectorAll(".btnLike")
            const displaysLike = document.querySelectorAll("small")

            let body = {
                action:"",
                idUser: id
            }

            btnsLike.forEach((item,index)=>{
                if(profiles[index].curtido == 1){
                    item.style.border = "1px solid red"
                }else{
                    item.style.border = "none"
                }
                
                item.addEventListener("click", async ()=>{
                    let numberLikes = Number.parseInt(displaysLike[index].innerHTML)

                    if(profiles[index].curtido == 0){
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
                    const responseLike = await requestLikeProfile(profiles[index].id,body)
                    body = JSON.parse(body)
                              
                    displaysLike[index].innerHTML = numberLikes
                })
            })
        }else{
            renderAlert(response.message)
        }
    }

    await loadPage(1)
})

btnLogout.addEventListener('click', async ()=>{
    await logout()
})