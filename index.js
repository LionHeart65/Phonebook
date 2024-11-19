const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
morgan.token('body', (req) => {
    return JSON.stringify(req.body);
});
app.use(morgan("tiny"))

app.use(morgan(':body'))

let jsonData = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get("/api/persons/:id", (request, response) => {
    const person = jsonData.find(person => person.id == request.params.id)
    if (!person) {
        response.status(404).end()
    } else {
        response.send(person)
    }
})

app.post("/api/persons", (request, response) => {
    const data = request.body
    const id = Math.floor(Math.random() * 10000)
    const name = data.name
    const number = data.number
    const json = { name, number, id }

    if (!json.name || !json.number) {
        return response.status(400).send({ error: 'missing name or number' }).end()
    } else if (jsonData.some(obj => obj.name === name)) {
        return response.status(400).send({ error: 'name must be unique' }).end()
    } else {
        jsonData = jsonData.concat(json)
        response.send(json)
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const newData = jsonData.filter(person => person.id != id)
    jsonData = newData
    response.send(newData)
})

app.get("/api/persons", (request, response) => {
    response.send(jsonData)
})

app.get("/info", (request, response) => {
    const data = request.data
    const p1 = `<p> Phonebook has info for ${jsonData.length} people `
    const date = new Date()

    response.send(p1 + "<br/>" + date)
})

app.listen(PORT)
