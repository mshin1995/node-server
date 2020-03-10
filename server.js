const google = require('googleapis')
const sheets = google.sheets('v4')
const spreadsheetId = '1dG_Bxm2UfnpMCvtbscuY-NnvNnOQ7izLzPvFstXyPiM'
const credentials = require('./credentials.json')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())