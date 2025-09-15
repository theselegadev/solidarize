import {requestLogin} from "./request.js"
import {renderAlert} from "./module.js"

document.addEventListener('DOMContentLoaded',async ()=>{
    const form = document.querySelector("#form")
    const inputs = document.querySelectorAll(".form-control")

    form.addEventListener("submit", async (e)=>{
        e.preventDefault()

        const body = JSON.stringify(
            {
                name: inputs[0].value,
                cnpj: inputs[1].value,
                password: inputs[2].value   
            }
        )

        const response = await requestLogin(body,"ong")
        
        response.status === "success" 
        ? location.replace("http://localhost:8081/solidarize/App/homeOng.html") 
        : renderAlert(response.message)
    })
})