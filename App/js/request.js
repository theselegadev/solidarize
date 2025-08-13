// função que faz requisição no método post na rota /user da api para criar usuário
async function requestCreateAccount(body){
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

export default requestCreateAccount