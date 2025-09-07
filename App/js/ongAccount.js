import { logout } from "./module.js";
import { requestGetOng, requestDataUser, requestUpdateOng, requestGetObjectives, requestDefineObjectivesOng, requestGetObjectivesOng, requestUpdateObjectivesOng, requestGetProfileOng, requestCreateProfileOng, requestUpdateProfileOng, requestUploadImageProfileOng } from "./request.js";

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
    const containerProfile = document.querySelector("#container-profile")
    const formProfile = document.querySelector("#formProfile")
    const inputsProfile = document.querySelectorAll("textarea")
    const btnProfile = document.querySelector("#btn-profile")
    const modalTitle = document.querySelector("#modalTitle")
    const btnSubmitProfile = document.querySelector("#btnProfile")
    const toastElement = document.getElementById('liveToast')

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


    const responseProfile = await requestGetProfileOng(id)

    if(responseProfile.status == 'error'){
        containerProfile.innerHTML = `
            <div class="alert alert-warning d-flex align-items-center gap-3" role="alert">
                <i class="bi bi-exclamation-triangle-fill"></i>
                <div>
                    ${responseProfile.message}, crie um perfil
                </div>
            </div>
        `
        btnProfile.innerHTML = "Criar"
        modalTitle.innerHTML = "Criar Perfil"
        btnSubmitProfile.innerHTML = "Criar Perfil"
    }else{
        containerProfile.innerHTML = 
        `
            <div class="card">
                <div class="position-relative d-inline-block">
                    <img src='http://localhost/solidarize/Api/${responseProfile.data.foto}' style="height: 350px;width: 543px" id="imageProfile">
                    <label for="inputFile" class="bg-light d-flex justify-content-center align-items-center shadow-sm" style="position: absolute; bottom: 10px; right: 10px; border-radius: 50%; height: 50px; width: 50px; cursor: pointer;">
                        <i class="bi bi-camera fs-3"></i>
                    </label>
                    <form action="" id="formImage">
                        <input type="file" id="inputFile" style="display: none;" name="image">
                    </form>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${responseProfile.data.descricao}</h5>
                    <p class="card-text">${responseProfile.data.missao}</p>
                    <p class="card-text">${responseProfile.data.visao}</p>
                    <p class="card-text">${responseProfile.data.valores}</p>
                    
                </div>
            </div>
        `
        btnProfile.innerHTML = "Editar"
        modalTitle.innerHTML = "Editar Perfil"
        btnSubmitProfile.innerHTML = "Editar Perfil"

        inputsProfile[0].value = responseProfile.data.missao
        inputsProfile[1].value = responseProfile.data.visao
        inputsProfile[2].value = responseProfile.data.valores
        inputsProfile[3].value = responseProfile.data.descricao
    }

    // envio do formulário de criação de perfil
    formProfile.addEventListener('submit', async (e)=>{
        e.preventDefault()

        const bodyProfile = JSON.stringify(
            {
                mission: inputsProfile[0].value,
                vision: inputsProfile[1].value,
                values: inputsProfile[2].value,
                description: inputsProfile[3].value
            }
        )

        let profileOng

        if(responseProfile.status == 'error'){
            profileOng = await requestCreateProfileOng(id,bodyProfile)
        }else{
            profileOng = await requestUpdateProfileOng(id,bodyProfile)
        }

        location.replace("http://localhost/solidarize/App/ongAccount.html")
    })

    // upload da imagem do perfil da ong
    if(responseProfile.status == 'success'){
        document.querySelector("#inputFile").addEventListener("change", async () => {
            const formImage = document.querySelector("#formImage")
            const formData = new FormData(formImage)

            const responseUploadImage = await requestUploadImageProfileOng(id,formData)
            const responseImage = responseUploadImage.data.path
            document.querySelector("#imageProfile").src = `http://localhost/solidarize/Api/${responseImage}`

            document.querySelector('#toast-body').textContent = responseUploadImage.message
            const toast = new bootstrap.Toast(toastElement)
            toast.show()
        })
    }

    // envio do formulário de conta
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

        document.querySelector('#toast-body').textContent = responseUpdate.message
        const toast = new bootstrap.Toast(toastElement)
        toast.show()
    })

    let responseObjectives = await requestGetObjectives()
    let objectives = responseObjectives.data
        
    titlesObjectives.forEach((item, index) => item.innerHTML = objectives[index].nome)
    descObjectives.forEach((item,index)=>item.innerHTML = objectives[index].descricao)
    inputsObjectives.forEach((item,index)=>item.value = objectives[index].id)

    let responseObjectivesOng = await requestGetObjectivesOng(id)
    let choiceObjectives = responseObjectivesOng.data

    for(let i = 0; i < inputsObjectives.length; i++){
        choiceObjectives.forEach(item => {
            if(inputsObjectives[i].value == item.id){
                inputsObjectives[i].checked = true
            }
        })
    }

    //envio do formulário de objetivos
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

        responseObjectivesOng = await requestGetObjectivesOng(id)
        choiceObjectives = responseObjectivesOng.data
        document.querySelector('#toast-body').textContent = response.message
        const toast = new bootstrap.Toast(toastElement)
        toast.show()
    })
})

