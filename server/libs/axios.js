const axios = require('axios')

module.exports.axios = axios.create({
  timeout: 0,
  responseType: 'json',
  responseEncoding: 'utf8'
})
