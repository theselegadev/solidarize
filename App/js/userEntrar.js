import {requestCreateAccount} from "./request.js"

document.querySelector("#form").addEventListener('submit', async (e)=>{
    e.preventDefault()
    const inputs = document.querySelectorAll('.form-control')
    const select = document.querySelector("#state")
    const jsonBody = JSON.stringify(
        {
            name: inputs[0].value,
            email: inputs[1].value,
            password: inputs[4].value,
            tel: inputs[2].value,
            city: select.value,
            state: inputs[3].value
        }
    )
    
    const response = await requestCreateAccount(jsonBody)

    if(response.status == "success"){
        localStorage.setItem('data_user',JSON.stringify(response.data)) 
        window.location.replace("http://localhost/solidarize/App/home.html")
    }
})