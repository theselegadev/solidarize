import { logout } from "./module.js";

const btnLogout = document.querySelector("#logout")

btnLogout.addEventListener('click', async ()=>{
    await logout()
})