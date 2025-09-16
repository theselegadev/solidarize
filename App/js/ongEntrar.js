import { requestCreateOng } from "./request.js";
const form = document.querySelector('#form')
const inputs = document.querySelectorAll('.form-control')
const select = document.querySelector('#state')

form.addEventListener('submit',async (event)=>{
    event.preventDefault()
    
    const body = JSON.stringify(
        {
            name: inputs[0].value,
            cnpj: inputs[1].value,
            city: inputs[2].value,
            state: select.value,
            tel: inputs[3].value,
            email: inputs[4].value,
            password: inputs[5].value
        }
    )

    const response = await requestCreateOng(body)
    
    if(response.status = 'success'){
        location.replace("http://localhost/solidarize/App/homeOng.html")
    }
})