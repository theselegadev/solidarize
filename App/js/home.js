import { showUserData, logout,renderPagination, renderProfiles, renderAlert, handleVolunteer } from "./module.js";
import { requestGetProfileRecommended, requestLikeProfile, requestDefineVolunteer, requestGetUser } from "./request.js";

const btnLogout = document.querySelector("#logout")

document.addEventListener('DOMContentLoaded', async ()=>{
  const id = await showUserData()
  
  
  async function loadPage(page){
    const response = await requestGetProfileRecommended(id,page)
    const currentPage = response.data.page
    const totalPage = response.data.total_pages
    
    if(response.status === 'success'){
      const profiles = response.data.profiles
       
      renderProfiles(profiles)
      renderPagination(totalPage,currentPage,loadPage)
      
      const btnsLike = document.querySelectorAll("#btnLike")
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
        
        item.addEventListener("click",async ()=>{
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
          await requestLikeProfile(profiles[index].id,body)
          body = JSON.parse(body)
          
          displaysLike[index].innerHTML = numberLikes
        })
      })
    }else{
      renderAlert(response.message)
    }
    
    
  }
  
  await loadPage(1)

  await handleVolunteer(id)

})

btnLogout.addEventListener('click', async ()=>{
    await logout()
})