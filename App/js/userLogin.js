import { requestLogin } from "./request.js";
import { renderAlert } from "./module.js";

document.addEventListener("DOMContentLoaded",async ()=>{
    const inputs = document.querySelectorAll(".form-control")
    const form = document.querySelector("#form")
    
    form.addEventListener("submit",async (e)=>{
        e.preventDefault()

        const body = JSON.stringify(
            {
                name: inputs[0].value,
                password: inputs[1].value
            }
        )
        const response = await requestLogin(body,"user")
        
        response.status === "success" 
        ? location.replace("http://localhost/solidarize/App/home.html") 
        : renderAlert(response.message) 
    })

})