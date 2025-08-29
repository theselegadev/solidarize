import { requestGetOng, requestDataUser, requestUpdateOng } from "./request.js";

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


})