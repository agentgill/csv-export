# Parsing Salesforce json response is easy

Sometimes the best way to hanlde salesforce data is in json. If you like exeucting soql queries
which include related fields, while you can see the results in developer console, if you were to execute
the soql query via the sfdx cli like this -

```bash
sfdx force:data:soql:query -q "SELECT Id, Subject, WhatId, Owner.Name,Type,
    TYPEOF What WHEN Case THEN Contact.Email, Contact.State__c END
FROM Task
WHERE
      What.Type IN ('Case')  AND Subject like '%legal%' and Type = 'Call'
AND
       WhatId   IN (SELECT Id FROM Case WHERE RecordType.Name != 'iContact Service'
AND ClosedDate != TODAY)
" -r csv > data/input.csv

```

You would see this -

```csv
Id,Subject,WhatId,Owner.Name,Type,What
00T3E00000BpvEtUAJ,Legal Case,5003E00000FjvYQQAZ,Micheal Gill,Call,[object Object]
00T3E00000BqL8VUAV,Legal,5003E00000FjvYQQAZ,Micheal Gill,Call,[object Object]
```

However output as json -

```bash
sfdx force:data:soql:query -q "SELECT Id, Subject, WhatId, Owner.Name,Type,
    TYPEOF What WHEN Case THEN Contact.Email, Contact.State__c END
FROM Task
WHERE
      What.Type IN ('Case')  AND Subject like '%legal%' and Type = 'Call'
AND
       WhatId   IN (SELECT Id FROM Case WHERE RecordType.Name != 'iContact Service'
AND ClosedDate != TODAY)
" -r json > data/input.json

```

And you now get all your data...

```json
{
  "status": 0,
  "result": {
    "totalSize": 2,
    "done": true,
    "records": [
      {
        "attributes": {
          "type": "Task",
          "url": "/services/data/v46.0/sobjects/Task/00T3E00000BpvEtUAJ"
        },
        "Id": "00T3E00000BpvEtUAJ",
        "Subject": "Legal Case",
        "WhatId": "5003E00000FjvYQQAZ",
        "Owner": {
          "attributes": {
            "type": "Name",
            "url": "/services/data/v46.0/sobjects/User/0053E000003dbA5QAI"
          },
          "Name": "Micheal Gill"
        },
        "Type": "Call",
        "CaseOwnerTeam__c": "Legal Services",
        "What": {
          "attributes": {
            "type": "Case",
            "url": "/services/data/v46.0/sobjects/Case/5003E00000FjvYQQAZ"
          },
          "Contact": {
            "attributes": {
              "type": "Contact",
              "url": "/services/data/v46.0/sobjects/Contact/0033E00001ASR8YQAX"
            },
            "Email": "acegill2013@gmail.com",
            "State__c": "Prospect"
          }
        }
      },
      {
        "attributes": {
          "type": "Task",
          "url": "/services/data/v46.0/sobjects/Task/00T3E00000BqL8VUAV"
        },
        "Id": "00T3E00000BqL8VUAV",
        "Subject": "Legal",
        "WhatId": "5003E00000FjvYQQAZ",
        "Owner": {
          "attributes": {
            "type": "Name",
            "url": "/services/data/v46.0/sobjects/User/0053E000003dbA5QAI"
          },
          "Name": "Micheal Gill"
        },
        "Type": "Call",
        "CaseOwnerTeam__c": "Legal Services",
        "What": {
          "attributes": {
            "type": "Case",
            "url": "/services/data/v46.0/sobjects/Case/5003E00000FjvYQQAZ"
          },
          "Contact": {
            "attributes": {
              "type": "Contact",
              "url": "/services/data/v46.0/sobjects/Contact/0033E00001ASR8YQAX"
            },
            "Email": "acegill2013@gmail.com",
            "State__c": "Prospect"
          }
        }
      }
    ]
  }
}
```

json looks great but sometime all you really want is a CSV file!

With a little help of node and the following libraries - you can injest json and output as csv

- json2csv
- fs

```bash
node bin/export.js
```
