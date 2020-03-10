const {google} = require('googleapis')
const sheets = google.sheets('v4')
const spreadsheetId = '1dG_Bxm2UfnpMCvtbscuY-NnvNnOQ7izLzPvFstXyPiM'
const credentials = require('./credentials.json')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())

const auth = new google.auth.JWT (
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets'],
    null
)

google.options({auth})

sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Sheet1',  
}, (err, resp) => {
    if(err) {
        console.log(err);
    } else {
        console.log(resp.data.values)
    }
});