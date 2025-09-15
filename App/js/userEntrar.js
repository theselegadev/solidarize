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
            city: inputs[3].value,
            state: select.value
        }
    )
    
    const response = await requestCreateAccount(jsonBody)

    if(response.status == "success"){
        window.location.replace("http://localhost:8081/solidarize/App/home.html")
    }
})