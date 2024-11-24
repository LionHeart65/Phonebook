const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://phonebook:${password}@cluster0.28xtj.mongodb.net/people?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('User', personSchema)

if (!name && !number) {
	Person.find({}).then(result => {
		result.forEach(note => {
		console.log(note)
		})
		mongoose.connection.close()
	})
} else {

const person = new Person({
  name: name,
  number: number,
})

person.save().then(result => {
  console.log(`added ${result.name} number ${result.number} to phonebook`)
  mongoose.connection.close()

})

}