import { requestGetUser } from "./request.js?v=2"

const image_display = document.querySelector("#image-user")
const name_display = document.querySelector("#show-name-user")
const data_user = JSON.parse(localStorage.getItem("data_user"))
console.log(image_display,name_display,data_user.user_id)

document.addEventListener('DOMContentLoaded', async ()=>{
    const response = await requestGetUser(data_user.user_id)
    const data = response.data

    console.log(data.foto)

    name_display.innerHTML = data.nome
    image_display.src = `http://localhost/solidarize/Api/${data.foto}`
})