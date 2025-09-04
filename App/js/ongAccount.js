import { logout } from "./module.js";
import { requestGetOng, requestDataUser, requestUpdateOng, requestGetObjectives, requestDefineObjectivesOng, requestGetObjectivesOng, requestUpdateObjectivesOng } from "./request.js";

const btnLogout = document.querySelector("#logout")

btnLogout.addEventListener('click', async ()=>{
    await logout()
})

document.addEventListener('DOMContentLoaded', async () => {
    const responseDataUser = await requestDataUser()
    const id = responseDataUser.data.user_id
    const response = await requestGetOng(id)
    const dataOng = response.data
    const inputs = document.querySelectorAll(".form-control[disabled]")
    const select = document.querySelector("#state")
    const boxUpdate = document.querySelector("#boxUpdate")
    const btnEdit = document.querySelector("#btn-edit")
    const form = document.querySelector("#form")
    const titlesObjectives = document.querySelectorAll('#card-title')
    const descObjectives = document.querySelectorAll('#card-text')
    const inputsObjectives = document.querySelectorAll('.btn-check')
    const formObjectives = document.querySelector("#form-objectives")

    inputs[0].value = dataOng.nome
    inputs[1].value = dataOng.email
    inputs[2].value = dataOng.telefone
    inputs[3].value = dataOng.cidade
    select.value = dataOng.estado

    btnEdit.addEventListener('click', ()=>{
        boxUpdate.innerHTML = "<button class='btn btn-success mt-2 w-50 fs-6' id='btn-update'>Atualizar dados</button>"
        inputs.forEach(item=>{
            item.disabled = false
        })
        select.disabled = false
    })

    form.addEventListener('submit', async (e)=>{
        e.preventDefault()

        const body = JSON.stringify(
            {
                name: inputs[0].value,
                email: inputs[1].value,
                tel: inputs[2].value,
                city: inputs[3].value,
                state: select.value   
            }
        )

        const responseUpdate = await requestUpdateOng(id,body)
        console.log(responseUpdate)
        boxUpdate.innerHTML = ""

        inputs.forEach(item=>item.disabled = true)
        select.disabled = true
    })

    let responseObjectives = await requestGetObjectives()
    
    let objectives = responseObjectives.data
        
    titlesObjectives.forEach((item, index) => item.innerHTML = objectives[index].nome)
    descObjectives.forEach((item,index)=>item.innerHTML = objectives[index].descricao)
    inputsObjectives.forEach((item,index)=>item.value = objectives[index].id)

    const responseObjectivesOng = await requestGetObjectivesOng(id)
    const choiceObjectives = responseObjectivesOng.data

    for(let i = 0; i < inputsObjectives.length; i++){
        choiceObjectives.forEach(item => {
            if(inputsObjectives[i].value == item.id){
                inputsObjectives[i].checked = true
            }
        })
    }

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

        if(choiceObjectives.length > 0){
            response = await requestUpdateObjectivesOng(id, bodyObjectives) 
        }else{
            response = await requestDefineObjectivesOng(id,bodyObjectives)
        }

        responseObjectives = await requestGetObjectives()
    
        objectives = responseObjectives.data
    })
})