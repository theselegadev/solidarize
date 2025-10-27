import { handleNeedVolunteer, handleVolunteer, logout, renderAlert, showUserData } from "./module.js";
import { requestDataUser, requestFavoriteOng, requestGetObjectivesOng, requestGetObjectivesUser, requestGetOng, requestGetProfileOng, requestGetSessionProfile, requestGetUser } from "./request.js";

const btnLogout = document.querySelector("#logout")

document.addEventListener("DOMContentLoaded", async ()=>{
    const response = await requestGetSessionProfile()
    const idProfile = response.data.profile_id
    const profileType = response.data.profile_type
    const card = document.querySelector(".card-body")
    const cardContact = document.querySelector("#contact")
    const ongNameText = document.querySelector("#ongName")
    const toastElement = document.getElementById('liveToast')
    
    if(profileType == 'ong'){
        const id = await showUserData()
        const responseProfileOng = await requestGetProfileOng(idProfile,id)
        console.log(responseProfileOng)
        const idOng = responseProfileOng.data.id_ong
        await handleVolunteer(id)
        card.innerHTML = `
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>

        <div class="container mt-4">
            <div class="card shadow-sm rounded-3 p-4 border">
            <div class="position-relative text-center">
                <img src="http://localhost:8081/solidarize/Api/${responseProfileOng.data.foto}" 
                    class="img-fluid rounded shadow-sm"
                    style="height: 500px; width:100%; object-fit: cover; border-radius: 12px;" 
                    alt="Foto da ONG">

                <!-- Botão de Favoritar -->
                <button id="btnFavorite" class="btn btn-light shadow-sm position-absolute top-0 end-0 m-3 rounded-circle" style="width: 50px; height: 50px; display:flex; align-items:center; justify-content:center;">
                    <i class="bi bi-star fs-4"></i>
                </button>
            </div>

            <div class="mt-4">
                <div class="mb-3">
                    <label class="form-label fw-bold">Descrição</label>
                    <textarea readonly class="form-control shadow-sm" rows="2">${responseProfileOng.data.descricao}</textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Missão</label>
                    <textarea readonly class="form-control shadow-sm" rows="2">${responseProfileOng.data.missao}</textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Visão</label>
                    <textarea readonly class="form-control shadow-sm" rows="2">${responseProfileOng.data.visao}</textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Valores</label>
                    <textarea readonly class="form-control shadow-sm" rows="2">${responseProfileOng.data.valores}</textarea>
                </div>
            </div>
            </div>
        </div>
        `;

        const btnFavorite = document.getElementById("btnFavorite");
        const iconStar = btnFavorite.querySelector("i");
        let action

        if(responseProfileOng.data.favoritado == 0){
            action = "favorite"            
        }else{
            action = "desfavorite"
            iconStar.classList.add("bi-star-fill")
            iconStar.classList.remove("bi-star")
            iconStar.classList.add("text-warning")
        }
        
        btnFavorite.addEventListener("click", async () => {
    
            const body = JSON.stringify({
                id_ong: idOng,
                action        
            })

            if(action == "favorite"){
                action = "desfavorite"
            }else{
                action = "favorite"
            }

            const responseFavorite = await requestFavoriteOng(id,body)
            
            document.querySelector('#toast-body').textContent = responseFavorite.message
            const toast = new bootstrap.Toast(toastElement)
            toast.show()

            iconStar.classList.toggle("bi-star");
            iconStar.classList.toggle("bi-star-fill");
            iconStar.classList.toggle("text-warning");
        });

        const responseGetOng = await requestGetOng(idOng)
        console.log(idOng)
        ongNameText.innerHTML = responseGetOng.data.nome

        cardContact.innerHTML = `
            <div class="container mt-4">
                <h4 class="fw-bold mb-3">Objetivos da ONG</h4>
                <div id="objetivosContainer" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">

                </div>
            </div>

            <!-- Sessão de Contato e Localização -->
            <div class="container mt-5">
                <h4 class="fw-bold mb-3">Contato e Localização</h4>
                <div class="row g-3">
                <div class="col-md-6">
                    <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <h6 class="fw-bold mb-3"><i class="bi bi-geo-alt-fill text-danger"></i> Localização</h6>
                        <p class="mb-1"><strong>Estado:</strong> ${responseGetOng.data.estado}</p>
                        <p><strong>Cidade:</strong> ${responseGetOng.data.cidade}</p>
                    </div>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <h6 class="fw-bold mb-3"><i class="bi bi-telephone-fill text-primary"></i> Contato</h6>
                        <p class="mb-1"><strong>Email:</strong> ${responseGetOng.data.email}</p>
                        <p><strong>Telefone:</strong> ${responseGetOng.data.telefone}</p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        `

        const objetivosContainer = document.querySelector("#objetivosContainer")
        const responseGetObjectivesOng = await requestGetObjectivesOng(idOng)
        const objectives = responseGetObjectivesOng.data
        
        objectives.forEach(objective => {
            objetivosContainer.innerHTML += `
                <div class="col">
                    <div class="card shadow-sm h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-bullseye fs-1 text-success mb-2"></i>
                            <h6 class="card-title">Objetivo</h6>
                            <p class="card-text">${objective.nome}</p>
                        </div>
                    </div>
                </div>
            `
        });
    }else{
        const responseDataUser = await requestDataUser()
        const id = responseDataUser.data.user_id

        await handleNeedVolunteer(id)

        const responseUser = await requestGetUser(idProfile)
        console.log(responseUser) 
        card.innerHTML = `
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>

            <div class="container mt-5">
                <div class="card border-0 rounded-3 p-4 text-center">
                
                <img src="http://localhost:8081/solidarize/Api/${responseUser.data.foto}" 
                    alt="Foto do Voluntário"
                    class="rounded-circle shadow-sm m-auto"
                    style="width: 180px; height: 180px; object-fit: cover;">
                

                <div class="mt-4">
                    <h4 class="fw-bold mb-0">${responseUser.data.nome}</h4>
                </div>
                </div>
            </div>
        `

        cardContact.innerHTML = `
            <div class="container mt-4">
                <h4 class="fw-bold mb-3">Objetivos do Voluntário</h4>
                <div id="objetivosContainer" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">

                </div>
            </div>

            <!-- Sessão de Contato e Localização -->
            <div class="container mt-5">
                <h4 class="fw-bold mb-3">Contato e Localização</h4>
                <div class="row g-3">
                <div class="col-md-6">
                    <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <h6 class="fw-bold mb-3"><i class="bi bi-geo-alt-fill text-danger"></i> Localização</h6>
                        <p class="mb-1"><strong>Estado:</strong> ${responseUser.data.estado}</p>
                        <p><strong>Cidade:</strong> ${responseUser.data.cidade}</p>
                    </div>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <h6 class="fw-bold mb-3"><i class="bi bi-telephone-fill text-primary"></i> Contato</h6>
                        <p class="mb-1"><strong>Email:</strong> ${responseUser.data.email}</p>
                        <p><strong>Telefone:</strong> ${responseUser.data.telefone}</p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        `
        
        const responseObjectivesUser = await requestGetObjectivesUser(idProfile)
        const objectivesUser = responseObjectivesUser.data

        objectivesUser.forEach(objective => {
            objetivosContainer.innerHTML += `
                <div class="col">
                    <div class="card shadow-sm h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-bullseye fs-1 text-success mb-2"></i>
                            <h6 class="card-title">Objetivo</h6>
                            <p class="card-text">${objective.nome}</p>
                        </div>
                    </div>
                </div>
            `
        })

        if(objectivesUser.length < 1){
            objetivosContainer.innerHTML = `
            <div class="row mt-5 m-auto w-75">
                <div class="alert alert-warning" role="alert">
                    ${responseObjectivesUser.message}, voluntário sem objetivos definidos!
                </div>
            </div>
            `
        }
    }
})

btnLogout.addEventListener('click', async ()=>{
    await logout()
})