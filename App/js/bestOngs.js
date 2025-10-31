import { logout, renderPagination, renderAlert, showUserData, renderBestOngs, handleVolunteer, likeProfile, renderProfiles } from "./module.js"
import { requestBestOngs, requestSearch, requestFilterProfiles } from "./request.js"

const btnLogout = document.querySelector("#logout")

document.addEventListener('DOMContentLoaded', async () => {
    const id = await showUserData()
    const formSearch = document.querySelector("#formSearch")
    const inputSearch = document.querySelector("#inputSearch")
    const formFilter = document.querySelector("#formFilter")

    await handleVolunteer(id)

    async function loadPage(page){
        const response = await requestBestOngs(id,page)
        const currentPage = response.data.page
        const totalPage = response.data.total_pages
        
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

        formFilter.addEventListener("submit",async (e)=>{
            e.preventDefault()
        
            const cidade = document.querySelector("#cidade").value
            const estado = document.querySelector("#estado").value
            const objetivo = document.querySelector("#objetivo").value
            const precisa_voluntario = document.querySelector("#voluntarios").checked ? 1 : ""
        
            const body = JSON.stringify({
                user_type: "ong",
                cidade,
                estado,
                objetivo,
                precisa_voluntario
            })
        
            const responseFilter = await requestFilterProfiles(page, id, body)
              
            if(responseFilter.status == "success"){
                const profiles = responseFilter.data.profiles
                const totalPages = responseFilter.data.total_pages
                const currentPage = responseFilter.data.page
        
                renderProfiles(profiles)
                renderPagination(totalPages, currentPage, loadPage)
        
                likeProfile(profiles, id)
            }else{
                renderAlert(responseFilter.message)
            }
        })

        if(response.status == "success"){
            const profiles = response.data.profiles
            renderBestOngs(profiles)
            renderPagination(totalPage,currentPage,loadPage)
            likeProfile(profiles,id);
        }else{
            renderAlert(response.message)
        }
    }

    loadPage(1)
})

btnLogout.addEventListener('click', async ()=>{
    await logout()
})