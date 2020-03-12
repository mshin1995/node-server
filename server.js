const {google} = require('googleapis');
const spreadsheetId = '1dG_Bxm2UfnpMCvtbscuY-NnvNnOQ7izLzPvFstXyPiM'
const sheets = google.sheets('v4');
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

// async function accessSpreadsheet() {
//     const doc = new GoogleSpreadsheet('1dG_Bxm2UfnpMCvtbscuY-NnvNnOQ7izLzPvFstXyPiM');
//     await doc.useServiceAccountAuth((credentials));
//     await doc.loadInfo();
//     const sheet = doc.sheetsByIndex[0];
//     const rows = await sheet.getRows();
//     console.log(rows)
// }

// Tried to use the google-spreadsheet npm, but decided not to. One of the main issues I ran into while working on this assignment
// was trying to figure out how to effectively use Google Sheets as a database. I didn't know how to set unique identifiers 
// for each key-value pair using a Google Sheet which is needed to delete specific pairs. I did however know how to delete entire rows, so
// I set up individual key-value pairs on each row using the row's number as a unique id. That is why the solution I have implemented 
// above has a constraint of the key having to be the same number as the row it is on, since I was only able to use the row number as 
// the unique identifier for each key-value pair.