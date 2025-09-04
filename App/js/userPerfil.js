import { showUserData } from "./module.js";
import { logout } from "./module.js";
import { requestGetUser, requestUpdateUser, requestGetObjectives, requestDefineObjectivesUser, requestGetObjectivesUser, requestUpdateObjectivesUser, requestUploadImageUser } from "./request.js";

const btnLogout = document.querySelector("#logout")

btnLogout.addEventListener('click', async ()=>{
    await logout()
})

document.addEventListener('DOMContentLoaded', async ()=>{
    const id = await showUserData()
    const response = await requestGetUser(id)
    const userData = response.data
    const select = document.querySelector('#state')
    const nodeList = document.querySelectorAll('.form-control')
    const values = [userData.nome, userData.email, userData.telefone,userData.cidade,userData.estado]
    const btnEdit = document.querySelector('#btn-edit')
    const btnUpdate = document.querySelector('#btn-update')
    const form = document.querySelector('#form')
    const titlesObjectives = document.querySelectorAll('.card-title')
    const descObjectives = document.querySelectorAll('.card-text')
    const inputsObjectives = document.querySelectorAll('.btn-check')
    const formObjectives = document.querySelector('#form-objectives')
    const toastElement = document.getElementById('liveToast')


    btnUpdate.style.display = 'none'
    
    for (let index = 1, k = 0; index < nodeList.length; index++, k++) {
        nodeList[index].value = values[k]   
    }

    select.value = values[4]

    btnEdit.addEventListener('click',()=>{
        nodeList.forEach(input => input.removeAttribute('disabled'))
        select.removeAttribute('disabled')
        btnUpdate.style.display = 'block'  
    })

    const responseObjectives = await requestGetObjectives()

    const objectives = responseObjectives.data
    
    titlesObjectives.forEach((item, index) => item.innerHTML = objectives[index].nome)
    descObjectives.forEach((item,index)=>item.innerHTML = objectives[index].descricao)
    inputsObjectives.forEach((item,index)=>item.value = objectives[index].id)

    let responseUserObjectives = await requestGetObjectivesUser(id)

    let dataUserObjectives = responseUserObjectives.data

    for(let i = 0; i < inputsObjectives.length; i++){
        dataUserObjectives.forEach(item => {
            if(inputsObjectives[i].value == item.id){
                inputsObjectives[i].checked = true
            }
        })
    }
    
    document.querySelector('#inputFile').addEventListener('change', async ()=>{
        const formImage = document.querySelector('#formImage')
        const formData = new FormData(formImage)
        
        const response = await requestUploadImageUser(id,formData)
        const data = response.data
        
        document.querySelector('#toast-body').textContent = response.message
        const toast = new bootstrap.Toast(toastElement)
        toast.show()

        await showUserData()
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

        document.querySelector('#toast-body').textContent = response.message
        const toast = new bootstrap.Toast(toastElement)
        toast.show()


        select.disabled = true

        btnUpdate.style.display = 'none'
    })

    formObjectives.addEventListener('submit',async (e)=>{
        e.preventDefault()

        const arrObjectives = []

        inputsObjectives.forEach(inp=>{
            if(inp.checked){
                arrObjectives.push(inp.value)
            }
        })

        const bodyObjectives = JSON.stringify(
            {
                objetivos: arrObjectives
            }
        )

        let response

        if(dataUserObjectives.length > 0){
            response = await requestUpdateObjectivesUser(id,bodyObjectives)
        }else{
            response = await requestDefineObjectivesUser(id,bodyObjectives)
        }

        document.querySelector('#toast-body').textContent = response.message
        const toast = new bootstrap.Toast(toastElement)
        toast.show()

        responseUserObjectives = await requestGetObjectivesUser(id)
        dataUserObjectives = responseUserObjectives.data
    })
})
    

