import { logout, handleNeedVolunteer, renderPagination, renderAlert, renderProfilesVoluntarys } from "./module.js";
import { requestDataUser, requestGetVoluntarys } from "./request.js";

const btnLogout = document.querySelector("#logout")

document.addEventListener("DOMContentLoaded", async ()=>{
    const responseDataUser = await requestDataUser()
    const id = responseDataUser.data.user_id

    
    async function loadPage(page){
        const response = await requestGetVoluntarys(id,page)
        console.log(response)

        if(response.status == "success"){
            const totalPages = response.data.total_pages
            const currentPage = response.data.page
            const profiles = response.data.profiles

            renderProfilesVoluntarys(profiles)

            renderPagination(totalPages,currentPage,loadPage)    


        }else{
            renderAlert(response.message)
        }
    }
    
    loadPage(1)

    await handleNeedVolunteer(id)
})

btnLogout.addEventListener('click', async ()=>{
    await logout()
})