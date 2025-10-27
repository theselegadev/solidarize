import { logout, showUserData, renderPagination, renderFavorites, likeProfile, renderAlert} from "./module.js"
import { requestGetFavorites } from "./request.js"

const btnLogout = document.querySelector("#logout")

document.addEventListener("DOMContentLoaded", async ()=>{
    const id = await showUserData()

    async function loadPage(page){
        const response = await requestGetFavorites(id,page)

        if(response.status == "success"){
            const currentPage = response.data.page
            const totalPages = response.data.page
            const profiles = response.data.profiles

            renderFavorites(profiles,id, page)
            likeProfile(profiles,id)
            renderPagination(totalPages,currentPage,loadPage)
        }else{
            renderAlert(response.message)
        }
    }

    loadPage(1)
})


btnLogout.addEventListener('click', async ()=>{
    await logout()
})