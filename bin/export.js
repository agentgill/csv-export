/*
  @description  Parse JSON response and output CSV file
  @input        Salesforce JSON Response
  @output       CSV File
  @required     Nodejs, json2csv, fs
*/

const { parse } = require("json2csv");
const fs = require("fs");
var myData = JSON.parse(fs.readFileSync("data/input.json", "utf8"));
const fields = ["result.totalSize"];
const opts = { fields, header: false };

try {
  const csv = parse(myData, opts);
  numberOfRecords = csv;

  console.log(csv);
} catch (error) {
  console.log(error);
}

deleteCSV();

for (i = 0; i < numberOfRecords; i++) {
  console.log("record " + i);
  const fields = [
    {
      label: "Id",
      value: "result.records[" + i + "].Id"
    },
    {
      label: "Subject",
      value: "result.records[" + i + "].Subject"
    },
    {
      label: "Owner",
      value: "result.records[" + i + "].Owner.Name"
    },
    {
      label: "ContactEmail",
      value: "result.records[" + i + "].What.Contact.Email"
    },
    {
      label: "ContactState",
      value: "result.records[" + i + "].What.Contact.State__c"
    }
  ];

  if (i == 0) {
    const csvData = parse(myData, { fields, header: true });
    outputCSV(csvData + "\n");
  } else {
    const csvData = parse(myData, { fields, header: false });
    i == numberOfRecords ? outputCSV(csvData) : outputCSV(csvData) + "\n";
  }
}

function outputCSV(csvData) {
  fs.appendFile("data/output.csv", csvData, function(err) {
    if (err) throw err;
    console.log("Updated!");
  });
}

function deleteCSV() {
  fs.unlink("data/output.csv", function(err) {
    if (err) throw err;
    console.log("File deleted!");
  });
}
