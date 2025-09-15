import { logout, handleNeedVolunteer } from "./module.js";
import { requestDataUser } from "./request.js";

const btnLogout = document.querySelector("#logout")

document.addEventListener("DOMContentLoaded", async ()=>{
    const responseDataUser = await requestDataUser()
    const id = responseDataUser.data.user_id

    await handleNeedVolunteer(id)

})

btnLogout.addEventListener('click', async ()=>{
    await logout()
})