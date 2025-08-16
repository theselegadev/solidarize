import { showUserData } from "./module.js";
import { requestGetUser, requestUpdateUser } from "./request.js";

document.addEventListener('DOMContentLoaded', async ()=>{
    const id = await showUserData()
    const response = await requestGetUser(id)
    const userData = response.data
    const select = document.querySelector('#state')
    const nodeList = document.querySelectorAll('.form-control')
    const values = [userData.nome, userData.email, userData.telefone,userData.cidade,userData.estado]
    const btnEdit = document.querySelector('#btn-edit')
    const btnUpdate = document.querySelector('#btn-update')
    btnUpdate.style.display = 'none'
    const form = document.querySelector('#form')

    for (let index = 1, k = 0; index < nodeList.length; index++, k++) {
        nodeList[index].value = values[k]   
    }

    select.value = values[4]

    btnEdit.addEventListener('click',()=>{
        nodeList.forEach(input => input.removeAttribute('disabled'))
        select.removeAttribute('disabled')
        btnUpdate.style.display = 'block'  
    })

    form.addEventListener('submit',async (e)=>{
        e.preventDefault()

        const jsonBody = JSON.stringify(
            {
                name: nodeList[1].value,
                email: nodeList[2].value,
                tel: nodeList[3].value,
                city: nodeList[4].value,
                state: select.value
            }
        )

        const response = await requestUpdateUser(id,jsonBody)
        
        for(let index = 1; index < nodeList.length; index++){
            nodeList[index].disabled = true
        }

        select.disabled = true

        btnUpdate.style.display = 'none'
    })
})
    

