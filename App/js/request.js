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