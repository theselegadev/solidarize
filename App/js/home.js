import { showUserData, logout,renderPagination, renderProfiles, renderAlert } from "./module.js";
import { requestGetProfileRecommended, requestLikeProfile } from "./request.js";

const btnLogout = document.querySelector("#logout")

document.addEventListener('DOMContentLoaded', async ()=>{
  const id = await showUserData()

  async function loadPage(page){
    const response = await requestGetProfileRecommended(id,page)
    console.log(response.data.profiles)
    const currentPage = response.data.page
    const totalPage = response.data.total_pages
    
    if(response.status === 'success'){
      const profiles = response.data.profiles 
      renderProfiles(profiles)
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

        item.addEventListener("click",async ()=>{
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
      console.log(btnsLike)
    }else{
      renderAlert(response.message)
    }


  }
  
  await loadPage(1)
})

btnLogout.addEventListener('click', async ()=>{
    await logout()
})