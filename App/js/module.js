import { requestGetUser, requestDataUser, requestLogout, requestDefineVolunteer} from "./request.js?v=2"

export async function showUserData(){
    const image_display = document.querySelectorAll("#image-user")
    const name_display = document.querySelector("#show-name-user")

    const responseData = await requestDataUser()
    const data_user = responseData.data

    const response = await requestGetUser(data_user.user_id)
    const data = response.data

    name_display.innerHTML = data.nome

    image_display.forEach(item=>item.src = `http://localhost/solidarize/Api/${data.foto}`)

    return data_user.user_id
}

export async function logout(){
    const response = await requestLogout()

    location.replace("http://localhost/solidarize/App/index.html")
}

export function renderProfiles(profiles){
    const container = document.querySelector("#profiles-container")
    container.innerHTML = ""

    profiles.forEach(profile => {
        const card = document.createElement("div")
        card.className = "card"
        card.style.width = "18rem"
        card.innerHTML = `
        <div class="position-relative">
            <img src="http://localhost/solidarize/Api/${profile.foto_perfil}" class="card-img-top" alt="${profile.nome}">
            <div style="position: absolute; top: 8px; right:8px; display: flex; align-items: center; flex-direction: column">
                <button class="btn btn-light btn-sm p-1" style="border-radius:50%; width: 30px; height: 30px" id="btnLike">
                    <i class="bi bi-heart-fill text-danger"></i>
                </button>
                <small class="text-white bg-dark px-2 rounded mt-1">${profile.curtidas}</small>
            </div>
        </div>
        <div class="card-body">
            <h5 class="card-title">${profile.nome}</h5>
            <p class="card-text">${profile.descricao}</p>
            <p class="card-text"><strong>Missão:</strong> ${profile.missao}</p>
            <p class="card-text"><strong>Objetivos em comum:</strong> ${profile.objetivos_em_comum}</p>
            <a href="" class="btn btn-primary">Ver perfil</a>
        </div>
        `;

        container.appendChild(card);
    })
}

export function renderBestOngs(profiles){
    const container = document.querySelector("#profiles-container")
    container.innerHTML = ""

    profiles.forEach(profile => {
        const card = document.createElement("div")
        card.className = "card"
        card.style.width = "18rem"
        card.innerHTML = `
        <div class="position-relative">
            <img src="http://localhost/solidarize/Api/${profile.foto}" class="card-img-top" alt="${profile.nome}">
            <div style="position: absolute; top: 8px; right:8px; display: flex; align-items: center; flex-direction: column">
                <button class="btn btn-light btn-sm p-1" style="border-radius:50%; width: 30px; height: 30px" id="btnLike">
                    <i class="bi bi-heart-fill text-danger"></i>
                </button>
                <small class="text-white bg-dark px-2 rounded mt-1" id="like">${profile.curtidas}</small>
            </div>
        </div>
        <div class="card-body">
            <h5 class="card-title">${profile.nome}</h5>
            <p class="card-text">${profile.descricao}</p>
            <p class="card-text"><strong>Missão:</strong> ${profile.missao}</p>
            <a href="" class="btn btn-primary">Ver perfil</a>
        </div>
        `;

        container.appendChild(card);
    })
}

export function renderAlert(message){
    const container = document.querySelector("#profiles-container")
    container.innerHTML = `
            <div class="container">
                <div class="alert alert-warning d-flex align-items-center gap-3" role="alert">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                    <div>
                        ${message}
                    </div>
                </div>
            </div>
        `
    
}

export async function handleVolunteer(id){
    const btnVolunteer = document.querySelector("#btnVolunteer")
    let responseUser = await requestGetUser(id)
    const titleVolunteer = document.querySelector("#title-volunteer")
    const toastElement = document.getElementById('liveToast')
    const textVolunteer = document.querySelector("#text-volunteer")
    const textAlert = document.querySelector("#text-alert")

    
    if(responseUser.data.voluntario){
        titleVolunteer.innerHTML = "Certeza que deseja deixar de ser voluntário?"
        textVolunteer.innerHTML = "Ao deixar de ser voluntário, o seu perfil não ficará mais visível para as ONGs. Isso significa que as organizações não poderão encontrar seus dados de contato nem entrar em comunicação com você através da nossa plataforma."
    }else{
        titleVolunteer.innerHTML = "Tem certeza que deseja ser voluntário?"
        textVolunteer.innerHTML = "Ao aceitar se tornar um voluntário, você estará autorizando que os dados do seu perfil fiquem visíveis para as ONGs cadastradas na plataforma.Isso permitirá que elas possam visualizar suas informações e entrar em contato diretamente com você para oportunidades de voluntariado."
    }
    
    btnVolunteer.addEventListener('click', async ()=>{
        let body = {
          value: null
        }
    
        if(responseUser.data.voluntario){
          body.value = 0
        }else{
          body.value = 1
        }
    
        body = JSON.stringify(body)
        const response = await requestDefineVolunteer(id,body)
        body = JSON.parse(body)
        responseUser = await requestGetUser(id)

        document.querySelector('#toast-body').textContent = response.message
        const toast = new bootstrap.Toast(toastElement)
        toast.show()

        if(responseUser.data.voluntario){
            textAlert.innerHTML = "Status: Usuário definido como voluntário"
        }else{
            textAlert.innerHTML = "Status: Usuário definido como não voluntário"
        }
    })
}

export function renderPagination(totalPages,currentPage,loadPage){
    currentPage = Number.parseInt(currentPage)
    const pagination = document.querySelector(".pagination")
    pagination.innerHTML = ""
    
    const prevLi = document.createElement("li")
    prevLi.className = `page-item ${currentPage == 1 ? "disabled" : ""}`;
    prevLi.innerHTML = `<a class="page-link" href="#">Anterior</a>`
    prevLi.onclick = () => {
        if(currentPage > 1) loadPage(currentPage -1)
    }
    pagination.appendChild(prevLi)

    for(let i = 1; i <= totalPages; i++){
        const li = document.createElement("li")
        li.className = `page-item ${i == currentPage ? "active" : ""}`
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`
        li.onclick = () => loadPage(i)
        pagination.appendChild(li)
    }

    const nextLi = document.createElement("li")
    nextLi.className = `page-item ${currentPage == totalPages ? "disabled" : ""}`
    nextLi.innerHTML = `<a class="page-link" href="#">Próximo</a>`
    nextLi.onclick = () => {
        if(currentPage < totalPages) loadPage(currentPage + 1)
    }
    pagination.appendChild(nextLi)
}
