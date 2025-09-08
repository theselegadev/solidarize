// função que faz requisição no método post na rota /user da api para criar usuário
export async function requestCreateAccount(body){
    const endpoint = "http://localhost/solidarize/Api/user"
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
    const endpoint = "http://localhost/solidarize/Api/ong"
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
    const endpoint = `http://localhost/solidarize/Api/ong/${id}`
    const response = await fetch(endpoint)
    .catch(err=>console.error(("Erro: ", err)))

    return await response.json()
}

// função que faz a requisição no método put na rota /ong para atualizar os dados da ong
export async function requestUpdateOng(id,body){
    const endpoint = `http://localhost/solidarize/Api/ong/${id}`
    const response = await fetch(endpoint, {
        method: "PUT",
        headers:{
            "Content-Type": "application/json"
        },
        body: body
    }).catch(err=>console.error("Erro: ",err))

    return await response.json()
}

// função que faz a requisição no método get na rota /user da api bara buscar dados do user
export async function requestGetUser(id){
    const endpoint = `http://localhost/solidarize/Api/user/${id}`
    const response = await fetch(endpoint)
    .catch(err=>console.error("Erro: ", err))
    
    return await response.json()
}

// função que faz requisição no método put na rota /user da api para atualizar os dados
export async function requestUpdateUser(id,body){
    const endpoint = `http://localhost/solidarize/Api/user/${id}`
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
    const endpoint = "http://localhost/solidarize/Api/objectives"
    const response = await fetch(endpoint)
    .catch(err=>console.error("Erro: ", err))

    return await response.json()
}

// função que faz requisição no método post na rota /user-objective da api para cadastrar os objetivos escolhidos pelo user
export async function requestDefineObjectivesUser(id,body){
    const endpoint = `http://localhost/solidarize/Api/user-objective/${id}`
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
    const endpoint = `http://localhost/solidarize/Api/ong-objective/${id}`
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
    const endpoint = `http://localhost/solidarize/Api/user-objective/${id}`
    const response = await fetch(endpoint)
    .catch(err=>console.error("Erro: ", err))

    return await response.json()
}

// função que faz requisição no método get na rota /ong-objective da api para buscar os objetivos da ong
export async function requestGetObjectivesOng(id){
    const endpoint = `http://localhost/solidarize/Api/ong-objective/${id}`
    const response = await fetch(endpoint)
    .catch(err=>console.error("Erro: ", err))

    return await response.json()
}

// função que faz a requisição no método put na rota /ong-objective da api para atualizar os objetivos da ong
export async function requestUpdateObjectivesOng(id,body){
    const endpoint = `http://localhost/solidarize/Api/ong-objective/${id}`
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
    const endpoint = `http://localhost/solidarize/Api/user-objective/${id}`
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
    const endpoint = `http://localhost/solidarize/Api/user-image/${id}`
    const response = await fetch(endpoint,{
        method: "POST",
        body: body
    }).catch(err=>console.error("Erro: ",err))

    return await response.json()
}

// função que faz a requisição no método get na rota /data-user da api para pegar o id e o tipo do user
export async function requestDataUser(){
    const endpoint = "http://localhost/solidarize/Api/data-user"
    const response = await fetch(endpoint,{
        method: "GET",
        credentials: "include"
    }).catch(err=>console.error("Erro: ",err))

    return await response.json()
}

// função que faz a requisição no método post na rota /logout da api para pegar destruir a session do user
export async function requestLogout(){
    const endpoint = "http://localhost/solidarize/Api/logout"
    const response = await fetch(endpoint,{
        method:"POST"
    }).catch(err=>console.error("Erro: ", err))

    return await response.json()
}

// função que faz a requisição no método get na rota /ong-perfil da api para retornar os dados de perfil da ong
export async function requestGetProfileOng(id){
    const endpoint = `http://localhost/solidarize/Api/ong-perfil/${id}`
    const response = await fetch(endpoint)
    .catch((err)=>console.error("Erro: ", err))

    return await response.json()
}

// função que faz a requisição no método post na rota /ong-perfil da api para criar o perfil da ong
export async function requestCreateProfileOng(id,body){
    const endpoint = `http://localhost/solidarize/Api/ong-perfil/${id}`
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
    const endpoint = `http://localhost/solidarize/Api/ong-perfil/${id}`
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
    const endpoint = `http://localhost/solidarize/Api/ong-image/${id}`
    const response = await fetch(endpoint,{
        method: "POST",
        body: body
    }).catch(err=>console.error("Erro: ",err))

    return await response.json()
}

// função que faz a requisição no método get na rota /user-recommended para buscar os perfis recomendados para o usuário
export async function requestGetProfileRecommended(id,page){
    const endpoint = `http://localhost/solidarize/Api/user-recommended/${id}/${page}`
    const response = await fetch(endpoint)
    .catch(err=>console.error("Erro: ",err))

    return await response.json()
}