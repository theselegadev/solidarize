// função que faz requisição no método post na rota /user da api para criar usuário
export async function requestCreateAccount(body){
    const endpoint = "http://localhost:8081/solidarize/Api/user"
    const response = await fetch(endpoint,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: body
    }).catch(err=>console.error("Erro: ", err))

    return await response.json()
}

// função que faz requisição no método post na rota /ong da api para criar ong
export async function requestCreateOng(body){
    const endpoint = "http://localhost:8081/solidarize/Api/ong"
    const response = await fetch(endpoint,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: body
    }).catch(err=>console.error("Erro: ", err))

    return await response.json()
}

// função que faz a requisição no método get na rota /ong para buscar dados da ong
export async function requestGetOng(id){
    const endpoint = `http://localhost:8081/solidarize/Api/ong/${id}`
    const response = await fetch(endpoint)
    .catch(err=>console.error(("Erro: ", err)))

    return await response.json()
}

// função que faz a requisição no método put na rota /ong para atualizar os dados da ong
export async function requestUpdateOng(id,body){
    const endpoint = `http://localhost:8081/solidarize/Api/ong/${id}`
    const response = await fetch(endpoint, {
        method: "PUT",
        headers:{
            "Content-Type": "application/json"
        },
        body: body
    }).catch(err=>console.error("Erro: ",err))

    return await response.json()
}''

// função que faz a requisição no método get na rota /user da api bara buscar dados do user
export async function requestGetUser(id){
    const endpoint = `http://localhost:8081/solidarize/Api/user/${id}`
    const response = await fetch(endpoint)
    .catch(err=>console.error("Erro: ", err))
    
    return await response.json()
}

// função que faz requisição no método put na rota /user da api para atualizar os dados
export async function requestUpdateUser(id,body){
    const endpoint = `http://localhost:8081/solidarize/Api/user/${id}`
    const response = await fetch(endpoint,{
        method: "PUT",
        headers:{
            "Content-Type": "application/json"
        },
        body: body
    }).catch(err => console.error("Erro: ", err))

    return await response.json()
}

// função que faz requisição no método get na rota /objectives da api para buscar os objetivos
export async function requestGetObjectives(){
    const endpoint = "http://localhost:8081/solidarize/Api/objectives"
    const response = await fetch(endpoint)
    .catch(err=>console.error("Erro: ", err))

    return await response.json()
}

// função que faz requisição no método post na rota /user-objective da api para cadastrar os objetivos escolhidos pelo user
export async function requestDefineObjectivesUser(id,body){
    const endpoint = `http://localhost:8081/solidarize/Api/user-objective/${id}`
    const response = await fetch(endpoint,{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: body
    }).catch(err=>console.error("Erro: ", err))

    return await response.json()
}

// função que faz requisição no método post na rota /ong-objective da api para cadastrar os objetivos escolhidos pela ong
export async function requestDefineObjectivesOng(id,body){
    const endpoint = `http://localhost:8081/solidarize/Api/ong-objective/${id}`
    const response = await fetch(endpoint,{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: body
    }).catch(err=>console.error("Erro: ", err))

    return await response.json()
}

// função que faz requisição no método get na rota /user-objective da api para buscar os objetivos do user
export async function requestGetObjectivesUser(id){
    const endpoint = `http://localhost:8081/solidarize/Api/user-objective/${id}`
    const response = await fetch(endpoint)
    .catch(err=>console.error("Erro: ", err))

    return await response.json()
}

// função que faz requisição no método get na rota /ong-objective da api para buscar os objetivos da ong
export async function requestGetObjectivesOng(id){
    const endpoint = `http://localhost:8081/solidarize/Api/ong-objective/${id}`
    const response = await fetch(endpoint)
    .catch(err=>console.error("Erro: ", err))

    return await response.json()
}

// função que faz a requisição no método put na rota /ong-objective da api para atualizar os objetivos da ong
export async function requestUpdateObjectivesOng(id,body){
    const endpoint = `http://localhost:8081/solidarize/Api/ong-objective/${id}`
    const response = await fetch(endpoint,{
        method: "PUT",
        headers:{
            "Content-Type": "application/json"
        },
        body: body
    }).catch(err=>console.error("Erro: ", err))

    return await response.json()
}

// função que faz a requisição no método put na rota /user-objective da api para atualizar os objetivos do user
export async function requestUpdateObjectivesUser(id,body){
    const endpoint = `http://localhost:8081/solidarize/Api/user-objective/${id}`
    const response = await fetch(endpoint,{
        method: "PUT",
        headers:{
            "Content-Type": "application/json"
        },
        body: body
    }).catch(err=>console.error("Erro: ", err))

    return await response.json()
}

// função que faz a requisição no método post na rota /user-image da api para fazer o upload da imagem do user
export async function requestUploadImageUser(id,body){
    const endpoint = `http://localhost:8081/solidarize/Api/user-image/${id}`
    const response = await fetch(endpoint,{
        method: "POST",
        body: body
    }).catch(err=>console.error("Erro: ",err))

    return await response.json()
}

// função que faz a requisição no método get na rota /data-user da api para pegar o id e o tipo do user
export async function requestDataUser(){
    const endpoint = "http://localhost:8081/solidarize/Api/data-user"
    const response = await fetch(endpoint,{
        method: "GET",
        credentials: "include"
    }).catch(err=>console.error("Erro: ",err))

    return await response.json()
}

// função que faz a requisição no método post na rota /logout da api para pegar destruir a session do user
export async function requestLogout(){
    const endpoint = "http://localhost:8081/solidarize/Api/logout"
    const response = await fetch(endpoint,{
        method:"POST"
    }).catch(err=>console.error("Erro: ", err))

    return await response.json()
}

// função que faz a requisição no método get na rota /ong-perfil da api para retornar os dados de perfil da ong
export async function requestGetProfileOng(id,idUser = ""){
    const endpoint = `http://localhost:8081/solidarize/Api/ong-perfil/${id}${idUser ? `/${idUser}` : ""}`
    const response = await fetch(endpoint)
    .catch((err)=>console.error("Erro: ", err))

    return await response.json()
}

// função que faz a requisição no método post na rota /ong-perfil da api para criar o perfil da ong
export async function requestCreateProfileOng(id,body){
    const endpoint = `http://localhost:8081/solidarize/Api/ong-perfil/${id}`
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: body
    }).catch((err)=>console.error("Erro: ",err))

    return await response.json()
}

// função que faz a requisição no método put na rota /ong-perfil da api para atualizar o perfil da ong
export async function requestUpdateProfileOng(id,body) {
    const endpoint = `http://localhost:8081/solidarize/Api/ong-perfil/${id}`
    const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: body
    }).catch((err)=>console.error("Erro: ",err))

    return await response.json()
}

// função que faz a requisição no método post na rota /ong-image da api para fazer o upload da foto de perfil da ong
export async function requestUploadImageProfileOng(id,body) {
    const endpoint = `http://localhost:8081/solidarize/Api/ong-image/${id}`
    const response = await fetch(endpoint,{
        method: "POST",
        body: body
    }).catch(err=>console.error("Erro: ",err))

    return await response.json()
}

// função que faz a requisição no método get na rota /user-recommended para buscar os perfis recomendados para o usuário
export async function requestGetProfileRecommended(id,page){
    const endpoint = `http://localhost:8081/solidarize/Api/user-recommended/${id}/${page}`
    const response = await fetch(endpoint)
    .catch(err=>console.error("Erro: ",err))

    return await response.json()
}

// função que faz a requisição no método post na rota /login para fazer a autenticação de login
export async function requestLogin(body,userType){
    const endpoint = `http://localhost:8081/solidarize/Api/login/${userType}`
    const response = await fetch(endpoint,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: body
    }).catch(err=>console.error("Erro: ", err))

    return await response.json()
}

// função que faz a requisição no método post na rota /like-profile da api para curtir e descurtir o perfil
export async function requestLikeProfile(id,body){
    const endpoint = `http://localhost:8081/solidarize/Api/like-profile/${id}`
    const response = await fetch(endpoint,{
        method:"PUT",
        headers:{
            "Content-type":"application/json"
        },
        body:body
    }).catch(err=>console.error("Erro: ",err))

    return await response.json()
}

// função que faz requisição para rota /best-ongs da api e retorna os perfis das melhores ongs com base no número de curtidas
export async function requestBestOngs(id,page){
    const enpoint = `http://localhost:8081/solidarize/Api/best-ongs/${id}/${page}`
    const response = await fetch(enpoint)
    .catch(err=>console.error("Erro: ",err))
    
    return await response.json()
}

// função que faz requisição para a rota /user-volunteer da api e define se o usuário é ou não voluntário
export async function requestDefineVolunteer(id,body) {
    const endpoint = `http://localhost:8081/solidarize/Api/user-volunteer/${id}`
    const response = await fetch(endpoint,{
        method: "PUT",
        headers:{
            "Content-type":"application/json"
        },
        body: body
    }).catch(err=>console.error("Erro: ",err))

    return await response.json()
}

// função que faz requisição para a rota /ong-need-volunteer da api e deifine se a ong precisa ou não de volutários
export async function requestDefinenNeedVolunteer(id,body){
    const endpoint = `http://localhost:8081/solidarize/Api/ong-need-volunteer/${id}`
    const response = await fetch(endpoint,{
        method: "PUT",
        headers: {
            "Content-type":"application/json"
        },
        body:body
    }).catch(err=>console.error("Erro: ", err))

    return await response.json()
}

// função que faz requisição na rota /ong-recommended no método get para buscar os perfis dos usuários que são voluntários
export async function requestGetVoluntarys(id,page) {
    const endpoint = `http://localhost:8081/solidarize/Api/ong-recommended/${id}/${page}`
    const response = await fetch(endpoint)
    .catch(err => console.error("Erro: ", err))

    return await response.json()
}

// função que faz a requisição no método get na rota /need-volunteer da api para buscar as ongs que precisam de voluntários
export async function requestGetNeedVolunteers(id,page){
    const endpoint = `http://localhost:8081/solidarize/Api/need-volunteer/${id}/${page}`
    const response = await fetch(endpoint)
    .catch(err=>console.error("Erro: ", err))

    return await response.json()
}

// função que faz a requisição no método post na rota /session-profile da api para setar o id do perfil e o tipo
export async function requestSetSessionProfile(body){
    const endpoint = "http://localhost:8081/solidarize/Api/session-profile"
    const response = await fetch(endpoint,{
        method: "POST",
        headers:{
            "Content-type":"application/json"
        },
        body: body
    }).catch(err=>console.error("Erro: ", err))

    return await response.json()
}

// função que faz a requisição no método get na rota /session-profile da api para buscar o id do perfil e o tipo
export async function requestGetSessionProfile(){
    const endpoint = "http://localhost:8081/solidarize/Api/session-profile"
    const response = await fetch(endpoint)
    .catch(err=>console.error("Erro: ", err))

    return await response.json()
}

// função que faz requisição no método post na rota /search da api para efetuar a pesquisa
export async function requestSearch(id = "",page,body){
    const endpoint = `http://localhost:8081/solidarize/Api/search/${page}/${id}`
    const response = await fetch(endpoint,{
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        body:body
    }).catch(err=>console.error("Erro: ",err))

    return await response.json()
}

// função que faz a requisição para filtrar os perfis das ongs
export async function requestFilterProfilesOngs(page,idUser,body){
    const endpoint = `http://localhost:8081/solidarize/Api/filter/${page}/${idUser}`
    const response = await fetch(endpoint, {
        method: "POST",
        headers:{
            "Content-type":"application/json"
        },
        body: body
    })

    return await response.json()
}

// função que faz a requisição para atualizar a descrição de voluntario
export async function requestUpdateDescription(idUser,body){
    const enpoint = `http://localhost:8081/solidarize/Api/voluntary-description/${idUser}`
    const response = await fetch(enpoint,{
        method: "PATCH",
        headers:{
            "Content-type":"application/json"
        },
        body: body
    }).catch(err=>console.error("Erro: ",err))

    return await response.json()
}

// função que faz requisição para api favoritar o perfil da ong
export async function requestFavoriteOng(idUser,body) {
    const endpoint = `http://localhost:8081/solidarize/Api/user-favorite/${idUser}`
    const response = await fetch(endpoint,{
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        body
    })

    return await response.json()
}

// função que faz a requisição para api para buscar as ongs favoritadas pelo usuário

export async function requestGetFavorites(idUser,page){
    const endpoint = `http://localhost:8081/solidarize/Api/user-favorite/${idUser}/${page}`
    const response = await fetch(endpoint)
        .catch(err=>console.error("Erro: ",err))
    
    return await response.json()
}