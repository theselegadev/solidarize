import { showUserData, logout,renderPagination, renderProfiles, renderAlert } from "./module.js";
import { requestGetProfileRecommended } from "./request.js";

const btnLogout = document.querySelector("#logout")

document.addEventListener('DOMContentLoaded', async ()=>{
  const id = await showUserData()

  async function loadPage(page){
    const response = await requestGetProfileRecommended(id,page)
    console.log(response.data.profiles)
    const currentPage = response.data.page
    const totalPage = response.data.total_pages
    
    if(response.status === 'success'){
      renderProfiles(response.data.profiles)
      renderPagination(totalPage,currentPage,loadPage)
    }else{
      renderAlert(response.message)
    }


  }
  
  await loadPage(1)
})

btnLogout.addEventListener('click', async ()=>{
    await logout()
})