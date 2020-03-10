const {google} = require('googleapis');
const sheets = google.sheets('v4');
const spreadsheetId = '1dG_Bxm2UfnpMCvtbscuY-NnvNnOQ7izLzPvFstXyPiM';
const credentials = require('./credentials.json');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.json())

const auth = new google.auth.JWT (
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets'],
    null
)

google.options({auth})

app.get('/all', (req, res) => {
    sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1',  
    }, (err, response) => {
        if(err) {
            console.log(err);
        } else {
            res.send(response.data.values.map(([key, value]) => ({key, value})))
            console.log(response.data.values)
        }
    });
})

app.post('/data', (req, res) => {
    let row = req.body.key
    console.log(req.body)
    sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${row}:${row}`,
        valueInputOption: 'USER_ENTERED',
        includeValuesInResponse: true,
        resource: {
            values: [[req.body.key, req.body.value]]
        }
    }, (err, response) => {
        if(err) {
            console.log(err);
        } else {
            res.send(response.data.updates)
        }
    });
})

app.delete('/data/:key', (req, res) => {
    let row = req.params.key
    sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: `${row}:${row}`,
    },  (err, response) => {
        if(err) {
            console.log(err);
        } else {
            res.send(response.data.updates)
        }
    });
})

app.listen(3000)

