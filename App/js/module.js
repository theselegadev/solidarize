import {
  requestDefinenNeedVolunteer,
  requestFavoriteOng,
  requestGetFavorites,
  requestSetSessionProfile,
  requestUpdateDescription,
} from "./request.js";
import {
  requestGetUser,
  requestDataUser,
  requestLogout,
  requestDefineVolunteer,
  requestGetOng,
  requestLikeProfile
} from "./request.js?v=2";

export async function showUserData() {
  const image_display = document.querySelectorAll("#image-user");
  const name_display = document.querySelector("#show-name-user");

  const responseData = await requestDataUser();
  const data_user = responseData.data;

  const response = await requestGetUser(data_user.user_id);
  const data = response.data;

  name_display.innerHTML = data.nome;

  image_display.forEach(
    (item) => (item.src = `http://localhost:8081/solidarize/Api/${data.foto}`)
  );

  return data_user.user_id;
}

export async function logout() {
  const response = await requestLogout();

  location.replace("http://localhost:8081/solidarize/App/index.html");
}

export async function clickButtonViewProfile(id, profileType) {
  const body = JSON.stringify({
    id: id,
    profile_type: profileType,
  });

  await requestSetSessionProfile(body);
  if (profileType == "ong") {
    location.replace("http://localhost:8081/solidarize/App/viewPerfil.html");
  } else {
    location.replace(
      "http://localhost:8081/solidarize/App/viewPerfilVolunteer.html"
    );
  }
}

window.clickButtonViewProfile = clickButtonViewProfile;

export async function renderProfiles(profiles) {
  const container = document.querySelector("#profiles-container");
  container.innerHTML = "";

  profiles.forEach((profile) => {
    const card = document.createElement("div");
    card.className = "card shadow-sm";
    card.style.width = "18rem";
    card.style.height = "32rem"
    console.log(profile);
    card.innerHTML = `
        <div class="position-relative">
            <img src="http://localhost:8081/solidarize/Api/${profile.foto_perfil}" class="card-img-top" style="height:285px" alt="${profile.nome}">
            <div style="position: absolute; top: 8px; right:8px; display: flex; align-items: center; flex-direction: column">
                <button class="btn btn-light btn-sm p-1 btnLike" style="border-radius:50%; width: 30px; height: 30px" id="btnLike">
                    <i class="bi bi-heart-fill text-danger"></i>
                </button>
                <small class="text-white bg-dark px-2 rounded mt-1">${profile.curtidas}</small>
            </div>
        </div>
        <div class="card-body">
            <h5 class="card-title">${profile.nome}</h5>
            <p class="card-text">${profile.descricao}</p>
            <p class="card-text"><strong>Missão:</strong> ${profile.missao}</p>
            <p class="card-text"><strong>${profile.objetivos_em_comum ? "Objetivos em comum: " : "" }</strong> ${profile.objetivos_em_comum ? profile.objetivos_em_comum : ""}</p>
            <button id="btnViewProfiles" class="btn btn-primary" onclick="clickButtonViewProfile(${profile.id_ong},'ong')">Ver perfil</button>
        </div>
        `;

    container.appendChild(card);
  });
}

export function renderBestOngs(profiles) {
  const container = document.querySelector("#profiles-container");
  container.innerHTML = "";

  profiles.forEach((profile) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.width = "18rem";
    card.innerHTML = `
        <div class="position-relative">
            <img src="http://localhost:8081/solidarize/Api/${profile.foto}" class="card-img-top" style="height:285px" alt="${profile.nome}">
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
            <button id="btnViewProfiles" class="btn btn-primary" onclick="clickButtonViewProfile(${profile.id_ong},'ong')">Ver perfil</button>
        </div>
        `;

    container.appendChild(card);
  });
}

export function renderAlert(message) {
  const container = document.querySelector("#profiles-container");
  container.innerHTML = `
            <div class="container">
                <div class="alert alert-warning d-flex align-items-center gap-3" role="alert">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                    <div>
                        ${message}
                    </div>
                </div>
            </div>
        `;
}

export async function handleVolunteer(id,description,handleDescription) {
  const btnVolunteer = document.querySelector("#btnVolunteer");
  let responseUser = await requestGetUser(id);
  const titleVolunteer = document.querySelector("#title-volunteer");
  const toastElement = document.getElementById("liveToast");
  const textVolunteer = document.querySelector("#text-volunteer");
  const textAlert = document.querySelector("#text-alert");

  if (responseUser.data.voluntario == 1) {
    titleVolunteer.innerHTML = "Certeza que deseja deixar de ser voluntário?";
    textVolunteer.innerHTML =
      "Ao deixar de ser voluntário, o seu perfil não ficará mais visível para as ONGs. Isso significa que as organizações não poderão encontrar seus dados de contato nem entrar em comunicação com você através da nossa plataforma.";
    if (textAlert){
      textAlert.innerHTML = "Status: Usuário definido como voluntário";
      handleDescription(id,description)
    }
  } else {
    titleVolunteer.innerHTML = "Tem certeza que deseja ser voluntário?";
    textVolunteer.innerHTML =
      "Ao aceitar se tornar um voluntário, você estará autorizando que os dados do seu perfil fiquem visíveis para as ONGs cadastradas na plataforma.Isso permitirá que elas possam visualizar suas informações e entrar em contato diretamente com você para oportunidades de voluntariado.";
    if (textAlert){
      textAlert.innerHTML = "Status: Usuário definido como não voluntário";
      document.querySelector("#input-description")?.remove()
      document.querySelector("#btn-edit-description")?.remove()
      document.querySelector("#modal-description")?.remove()
    }
  }

  btnVolunteer.addEventListener("click", async () => {
    let body = {
      value: null,
    };

    if (responseUser.data.voluntario == 1) {
      body.value = 0;
    } else {
      body.value = 1;
    }

    body = JSON.stringify(body);
    const response = await requestDefineVolunteer(id, body);
    body = JSON.parse(body);
    responseUser = await requestGetUser(id);

    document.querySelector("#toast-body").textContent = response.message;
    const toast = new bootstrap.Toast(toastElement);
    toast.show();

    if (responseUser.data.voluntario == 1) {
      titleVolunteer.innerHTML = "Certeza que deseja deixar de ser voluntário?";
      textVolunteer.innerHTML =
        "Ao deixar de ser voluntário, o seu perfil não ficará mais visível para as ONGs. Isso significa que as organizações não poderão encontrar seus dados de contato nem entrar em comunicação com você através da nossa plataforma.";
      if (textAlert){
        textAlert.innerHTML = "Status: Usuário definido como voluntário";
        handleDescription(id,description)
      }
    } else {
      titleVolunteer.innerHTML = "Tem certeza que deseja ser voluntário?";
      textVolunteer.innerHTML =
        "Ao aceitar se tornar um voluntário, você estará autorizando que os dados do seu perfil fiquem visíveis para as ONGs cadastradas na plataforma.Isso permitirá que elas possam visualizar suas informações e entrar em contato diretamente com você para oportunidades de voluntariado.";
      if (textAlert){
        textAlert.innerHTML = "Status: Usuário definido como não voluntário";
        document.querySelector("#input-description")?.remove()
        document.querySelector("#btn-edit-description")?.remove()
        document.querySelector("#modal-description")?.remove()
      }
    }
  });
}

export async function handleNeedVolunteer(id) {
  const btnVolunteer = document.querySelector("#btnVolunteer");
  let response = await requestGetOng(id);
  const titleVolunteer = document.querySelector("#title-volunteer");
  const toastElement = document.getElementById("liveToast");
  const textAlert = document.querySelector("#text-alert");
  const textVolunteer = document.querySelector("#text-volunteer");

  if (response.data.precisa_voluntario == 1) {
    titleVolunteer.innerHTML = "Certeza que não precisa mais de voluntários?";
    textVolunteer.innerHTML =
      "Ao desmarcar a opção de necessidade de voluntários, o perfil da sua ONG deixará de aparecer na aba de organizações que estão buscando apoio. Assim, os usuários não verão mais sua ONG como disponível para voluntariado, até que essa opção seja ativada novamente.";
    if (textAlert)
      textAlert.innerHTML = "Status: definido que precisa de voluntários";
  } else {
    titleVolunteer.innerHTML = "Certeza que precisa de voluntários?";
    textVolunteer.innerHTML =
      "Ao marcar a opção de que sua ONG precisa de voluntários, o perfil da organização será exibido em uma aba especial destinada às ONGs que estão em busca de apoio. Dessa forma, usuários interessados poderão visualizar sua ONG e entrar em contato para oferecer ajuda.";
    if (textAlert)
      textAlert.innerHTML = "Status: definido que não precisa de voluntários";
  }

  btnVolunteer.addEventListener("click", async () => {
    let body = {
      value: null,
    };

    if (response.data.precisa_voluntario == 1) {
      body.value = 0;
    } else {
      body.value = 1;
    }

    body = JSON.stringify(body);
    const responseNeedVolunteer = await requestDefinenNeedVolunteer(id, body);
    console.log(responseNeedVolunteer);
    body = JSON.parse(body);
    response = await requestGetOng(id);

    document.querySelector("#toast-body").textContent =
      responseNeedVolunteer.message;
    const toast = new bootstrap.Toast(toastElement);
    toast.show();

    if (response.data.precisa_voluntario == 1) {
      titleVolunteer.innerHTML = "Certeza que não precisa mais de voluntários?";
      textVolunteer.innerHTML =
        "Ao desmarcar a opção de necessidade de voluntários, o perfil da sua ONG deixará de aparecer na aba de organizações que estão buscando apoio. Assim, os usuários não verão mais sua ONG como disponível para voluntariado, até que essa opção seja ativada novamente.";
      if (textAlert)
        textAlert.innerHTML = "Status: definido que precisa de voluntários";
    } else {
      titleVolunteer.innerHTML = "Certeza que precisa de voluntários?";
      textVolunteer.innerHTML =
        "Ao marcar a opção de que sua ONG precisa de voluntários, o perfil da organização será exibido em uma aba especial destinada às ONGs que estão em busca de apoio. Dessa forma, usuários interessados poderão visualizar sua ONG e entrar em contato para oferecer ajuda.";
      if (textAlert)
        textAlert.innerHTML = "Status: definido que não precisa de voluntários";
    }
  });
}

export function renderProfilesVoluntarys(profiles) {
  const container = document.querySelector("#profiles-container");
  container.innerHTML = "";

  profiles.forEach((profile) => {
    const card = document.createElement("div");
    card.className = "card shadow-sm";
    card.style.width = "20rem";
    card.style.height = "20rem";
    card.innerHTML = `
        <div class="card-header d-flex justify-content-left align-items-center gap-5">
            <img src="http://localhost:8081/solidarize/Api/${profile.foto}" class="rounded-circle" width="50px" alt="${profile.nome}">
            <h5 class="mt-3">${profile.nome}</p>
        </div>
        <div class="card-body d-flex flex-column justify-content-around">
            ${profile.objetivos_em_comum ? `<h5 class="card-title">Objetivos em comum: ${profile.objetivos_em_comum}</h5>` : "<h5>Descrição:</h5>"}
            <p class="card-text">${profile.descricao ? profile.descricao : "Voluntário sem descrição de perfil"}</p>
            <button id="btnViewProfiles" class="btn btn-primary" onclick="clickButtonViewProfile(${profile.id},'user')">Ver perfil</button>
        </div>
        `;

    container.appendChild(card);
  });
}

export function renderPagination(totalPages, currentPage, loadPage) {
  currentPage = Number.parseInt(currentPage);
  const pagination = document.querySelector(".pagination");
  pagination.innerHTML = "";

  const prevLi = document.createElement("li");
  prevLi.className = `page-item ${currentPage == 1 ? "disabled" : ""}`;
  prevLi.innerHTML = `<a class="page-link" href="#">Anterior</a>`;
  prevLi.onclick = () => {
    if (currentPage > 1) loadPage(currentPage - 1);
  };
  pagination.appendChild(prevLi);

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i == currentPage ? "active" : ""}`;
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.onclick = () => loadPage(i);
    pagination.appendChild(li);
  }

  const nextLi = document.createElement("li");
  nextLi.className = `page-item ${currentPage == totalPages ? "disabled" : ""}`;
  nextLi.innerHTML = `<a class="page-link" href="#">Próximo</a>`;
  nextLi.onclick = () => {
    if (currentPage < totalPages) loadPage(currentPage + 1);
  };
  pagination.appendChild(nextLi);
}

export async function likeProfile(profiles, id) {
  const btnsLike = document.querySelectorAll("#btnLike");
  const displaysLike = document.querySelectorAll("small");

  let body = {
    action: "",
    idUser: id,
  };

  btnsLike.forEach((item, index) => {
    if (profiles[index].curtido == 1) {
      item.style.border = "1px solid red";
    } else {
      item.style.border = "none";
    }

    item.addEventListener("click", async () => {
      let numberLikes = Number.parseInt(displaysLike[index].innerHTML);

      if (profiles[index].curtido == 0) {
        body.action = "increment";
        item.style.border = "1px solid red";
        profiles[index].curtido = 1;
        numberLikes++;
      } else {
        body.action = "decrement";
        item.style.border = "none";
        profiles[index].curtido = 0;
        numberLikes--;
      }


      body = JSON.stringify(body);
      const responseLike = await requestLikeProfile(profiles[index].id, body);
      body = JSON.parse(body);
      console.log(responseLike)
      displaysLike[index].innerHTML = numberLikes;
    });
  });
}

export function handleDescription (id, description){
  const container = document.querySelector("#container")
  const containerDescription = document.querySelector("#container-description")
  const containerbtn = document.querySelector("#container-button")
  const btnEdit = document.querySelector("#btn-edit-description")
  const toastElement = document.getElementById('liveToast')


  container.innerHTML = `<div class="modal fade" id="modal-description" tabindex="-1" >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Descrição de perfil</h3>
        </div>
        <form id="form-description">
          <div class="modal-body">
            <div class="mb-3">
              <label for="description" class="form-label">Descrição de perfil</label>
              <textarea class="form-control" id="description" rows="3" placeholder="Sua descrição de voluntário"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary">Salvar</button>
          </form>
          <button class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
          </div>
      </div>
    </div>
  </div>`

  containerDescription.innerHTML = `
    <div class="input-group" id="input-description">
      <span class="input-group-text">Descrição de voluntário</span>
      <textarea class="form-control" id="description-textarea" disabled required>${description ? description : "Não há descrição de voluntário"}</textarea>
    </div>
  `

  if(!btnEdit){
    const btn = document.createElement('button')
    btn.className = 'btn btn-primary btn-sm'
    btn.id = 'btn-edit-description'
    btn.setAttribute('data-bs-toggle', 'modal')
    btn.setAttribute('data-bs-target', '#modal-description')
    btn.textContent = 'Editar descrição'

    containerbtn.insertAdjacentElement('beforeend',btn)
  }

  const modal = new bootstrap.Modal(document.querySelector("#modal-description"))

  const formDescription = document.querySelector("#form-description")

  formDescription.addEventListener("submit",async (e)=>{
    e.preventDefault()

    const descricao = document.querySelector("#description").value
    const body = JSON.stringify({
      descricao
    })
    
    const responseDescription = await requestUpdateDescription(id,body)

    if(responseDescription.status == "success"){
      document.querySelector("#description-textarea").value = responseDescription.data.descricao
      modal.hide()

      document.querySelector('#toast-body').textContent = responseDescription.message
      const toast = new bootstrap.Toast(toastElement)
      toast.show() 
    }
  })
}

export async function renderFavorites(profiles,idUser, page){
  const list = document.querySelector("#list")
  const toastElement = document.getElementById('liveToast')

  list.innerHTML = ""  
  window.renderFavorites = renderFavorites

  async function desfavorite(id,idOng, renderFavorites){
    const body = JSON.stringify({
      id_ong: idOng,
      action: "desfavorite"
    })

    const responseDesfavorite = await requestFavoriteOng(id,body)
    const responseFavorites = await requestGetFavorites(idUser,page)
    renderFavorites(responseFavorites.data.profiles,idUser,page)

    likeProfile(responseFavorites.data.profiles,id)

    document.querySelector('#toast-body').textContent = responseDesfavorite.message
    const toast = new bootstrap.Toast(toastElement)
    toast.show()
  }

  window.desfavorite = desfavorite

  profiles.map(profile => {
    list.innerHTML += `
      <li class="list-group-item">
        <div class="row align-items-center g-3">   
          <div class="col-12 col-md-4 d-flex align-items-center gap-3">
            <img 
              src="http://localhost:8081/solidarize/Api/${profile.foto}" 
              alt="${profile.nome}"
              class="rounded-circle" 
              style="width: 50px; height: 50px; object-fit: cover;"
            />
            <p class="mb-0 fw-semibold">${profile.nome}</p>
            <p class="mb-0 fw-semibold">${profile.descricao}</p>
          </div>
          <div class="col-6 col-md-2 text-center">
            <button class="btn btn-light btn-sm rounded-circle p-2" id="btnLike" 
                style="width: 35px; height: 35px;" 
                title="Curtir">
              <i class="bi bi-heart-fill text-danger"></i>
            </button>
            <small class="badge bg-dark">${profile.curtidas}</small>
          </div>
          <div class="col-12 col-md-6 d-flex gap-2 justify-content-md-end">
            <button class="btn btn-light d-flex align-items-center gap-2" onclick="desfavorite(${idUser},${profile.id_ong},renderFavorites)">
              <i class="bi bi-star-fill text-warning"></i>
              <span class="d-none d-sm-inline">Desfavoritar</span>
            </button>
            <button class="btn btn-primary" onclick="clickButtonViewProfile(${profile.id_ong},'ong')">
              <span class="d-none d-sm-inline">Ver perfil</span>
              <i class="bi bi-eye d-sm-none"></i>
            </button>
          </div>
        </div>
      </li>
    `
  })

}