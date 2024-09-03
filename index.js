const express = require('express')
const { MongoClient, Collection, ObjectId } = require('mongodb')

const dbUser = 'lucasbeserrasilva18'
const dbPassword = '051Q7uODoTFUC886'

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

    app.get('/livros', async function (req, res) {
        // Acessamos a lista de itens no collection do MongoDB
        const itens = await collection.find().toArray()

        // Enviamos a lista de itens como resultado
        res.send(itens)
    })

    app.get('/livros/:id', async function (req, res) {
        // Acessamos o id da requisição
        const id = req.params.id

        const item = await collection.findOne({ _id: new ObjectId(id) })

        // Checamos se o item existe
        if (!item) {
            return res.status(404).send('Livro não encontrado')
        }

        // Enviamos o item procurado
        res.send(item)
    })

    app.put('/livros/:id', async function (req, res) {
        // Acessamos o id e body da requisição
        const id = req.params.id
        const newItem = req.body

        // Atualizamos na collection o novoItem pelo ID
        await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: newItem }
        )

        // Enviamos o resultado da requisição
        res.send(newItem)
    })

    app.delete('/livros/:id', async function (req, res) {
        // Acessamos o id da requisição
        const id = req.params.id

        // Deletamos o item da collection
        await collection.deleteOne({ _id: new ObjectId(id) })

        // Enviamos uma mensagem de sucesso
        res.send('Item removido com sucesso: ' + id)
    })

    app.listen(3000)

}

main()