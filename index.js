const express = require('express')
const { MongoClient, Collection } = require('mongodb')


const dbUrl = 'mongodb+srv://' + dbUser + ':' + dbPassword + '@cluster0.zaxp3ht.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const dbName = 'biblioteca'

async function main() {
    // Realizamos a conexão com o banco de dados
    const client = new MongoClient(dbUrl)
    console.log('Conectando ao banco de dados...')
    await client.connect()
    console.log('Banco de dados conectado com sucesso!')

    // Declaração de variaveis para manipular o banco
    const db = client.db(dbName)
    const collection = db.collection('livros')

    // Inicio o app
    const app = express()
    // Sinalizo para o Express que estamos usando JSON no Body
    app.use(express.json())

    app.post('/livros', async function (req, res) {
        // Acessamos o body da requisição
        const newItem = req.body

        // Checamos se `livro` está presente na requisição
        // if (!newItem || (!newItem.titulo && !newItem.autor && !newItem.anoPublicacao)) {
        //     return res.status(400).send('Corpo da requisição deve conter a propriedade `titulo`.')
        // }

        // Adicionamos na collection
        await collection.insertOne(newItem)

        res.status(201).send(newItem)
    })
    

    app.listen(3000)

}

main()