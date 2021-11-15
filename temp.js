var fs = require('fs');

var name = {
    name: 'tanqq',
    age: 20,
    sex: 'boy',
    hobbies: ['ball', 'swimming', 'mounting']
}

fs.writeFileSync('/test.js', JSON.stringify(name), { flag: 'w+', 'encoding': 'utf-8' })
var fileStr = fs.readFileSync('/test.js')
const fileObj = JSON.parse(fileStr)
console.log(fileObj, fileObj.age, fileObj.hobbies, fileObj.hobbies[0])