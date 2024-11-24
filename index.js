const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./Models/person')

const PORT = process.env.PORT || 3001
const errorHandler = (error, request, response, next) => {
    console.error(error.name)
    
    if (error.name === "CastError") {
        return response.status(404).send({error: "Bad ID"})
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
morgan.token('body', (req) => {
    return JSON.stringify(req.body);
});
app.use(morgan("tiny"))
app.use(morgan(':body'))


app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.post("/api/persons", (request, response,next) => {
    const data = request.body
    
    if (data === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }
    
    const person = new Person({
        name: data.name,
        number: data.number
    })
    
    person.save().then(newPerson => {
        response.json(newPerson)
    }).catch(error => next(error))

})


app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(person => response.status(204).end()).catch(error => next(error))
})

app.get("/api/persons/", (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    }
    )
})

app.put("/api/persons/:id", (request, response, next) => {
    const data = request.body

    if (data === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }
    const newPerson = {
        name: data.name,
        number: data.number
    }

    Person.findByIdAndUpdate(request.params.id, newPerson, {new: true, }).then(newPerson => response.json(newPerson)).catch(error => next(error))
})

app.get("/info", (request, response) => {
    const data = Person.find({}).then(data => {
    const p1 = `<p> Phonebook has info for ${data.length} people `
    const date = new Date()
    response.send(p1 + "<br/>" + date)
    })
    
})

app.use(errorHandler)
app.listen(PORT)
