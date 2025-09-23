import { handleVolunteer, likeProfile, logout, renderAlert, renderPagination, renderProfiles, showUserData } from "./module.js";
import { requestGetNeedVolunteers, requestSearch} from "./request.js";

const btnLogout = document.querySelector("#logout")

document.addEventListener("DOMContentLoaded", async ()=>{
    const id = await showUserData()
    const formSearch = document.querySelector("#formSearch")
    const inputSearch = document.querySelector("#inputSearch")

    async function loadPage(page){
        const response = await requestGetNeedVolunteers(id,page)
        const totalPages = response.data.total_pages
        const currentPage = response.data.page
        await handleVolunteer(id)

        formSearch.addEventListener("submit", async (e)=>{
            e.preventDefault()
            const body = JSON.stringify({
                user_type: "ong",
                pesquisa: inputSearch.value
            })
        
            const responseSearch = await requestSearch(id, 1, body)
            console.log(responseSearch)
        
            const totalPages = responseSearch.data.total_pages
            const currentPage = responseSearch.data.page
            const profiles = responseSearch.data.profiles
        
            if(responseSearch.status == "success"){
                await renderProfiles(profiles)
                renderPagination(totalPages,currentPage,loadPage)
                likeProfile(profiles,id)
            }else{
                renderAlert(responseSearch.message)
            }
        
        })

        if(response.status == "success"){
            const profiles = response.data.profiles

            await renderProfiles(profiles)
            renderPagination(totalPages,currentPage, loadPage)
            likeProfile(profiles,id)
        }else{
            renderAlert(response.message)
        }
    }

    await loadPage(1)
})

btnLogout.addEventListener('click', async ()=>{
    await logout()
})