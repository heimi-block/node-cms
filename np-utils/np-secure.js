const bcrypt = require('bcrypt')

const cryptPassword =  (myPlaintextPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(myPlaintextPassword, 10, (err, hash) => {
      // Store hash in your password DB.
      if(hash){
        resolve(hash)
      }else{
        reject(err)
      }
    })
  })
}

const comparePassword =  (myPlaintextPassword, hash) => {
  return new Promise((resolve, reject) => {
    // Load hash from your password DB.
    bcrypt.compare(myPlaintextPassword, hash, function(err, res) {
      // res == true
      if(res){
        resolve(res)
      }else{
        resolve(false)
      }
    })
  })
}

module.exports = {
  cryptPassword,
  comparePassword
}