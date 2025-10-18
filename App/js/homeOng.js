import { logout, handleNeedVolunteer, renderPagination, renderAlert, renderProfilesVoluntarys } from "./module.js";
import { requestDataUser, requestGetVoluntarys, requestSearch } from "./request.js";

const btnLogout = document.querySelector("#logout")

document.addEventListener("DOMContentLoaded", async ()=>{
    const responseDataUser = await requestDataUser()
    const id = responseDataUser.data.user_id
    const formSearch = document.querySelector("#formSearch")
    const search = document.querySelector("#search")

    async function loadPage(page){
        const response = await requestGetVoluntarys(id,page)
        console.log(response)

        formSearch.addEventListener('submit', async (e)=>{
            e.preventDefault()

            const body = JSON.stringify({
                user_type: "user",
                pesquisa: search.value
            })

            const responseSearch = await requestSearch(id,page, body)

            if(responseSearch.status == 'success'){
                const totalPages = responseSearch.data.total_pages
                const currentPage = responseSearch.data.page
                const profiles = responseSearch.data.profiles

                renderProfilesVoluntarys(profiles)

                renderPagination(totalPages,currentPage,loadPage)
            }else{
                renderAlert(responseSearch.message)
            }
        })  

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