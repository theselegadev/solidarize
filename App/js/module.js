import { requestGetUser, requestDataUser } from "./request.js?v=2"

export async function showUserData(){
    const image_display = document.querySelectorAll("#image-user")
    const name_display = document.querySelector("#show-name-user")

    const responseData = await requestDataUser()
    const data_user = responseData.data

    const response = await requestGetUser(data_user.user_id)
    const data = response.data

    name_display.innerHTML = data.nome

    image_display.forEach(item=>item.src = `http://localhost/solidarize/Api/${data.foto}`)

    return data_user.user_id
}