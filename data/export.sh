#!/usr/bin/env bash

# Execute SOQL query as JSON using sfdx cli
# Command  . data/export.sh
# Output   data/input.json

# Execute our cli command

sfdx force:data:soql:query -q "SELECT Id, Subject, WhatId, Owner.Name,Type, CaseOwnerTeam__c,
    TYPEOF What WHEN Case THEN Contact.Email, Contact.State__c END
FROM Task
WHERE
      What.Type IN ('Case')  AND Subject like '%legal%' and Type = 'Call'
AND
       WhatId   IN (SELECT Id FROM Case WHERE RecordType.Name != 'iContact Service'
AND ClosedDate != TODAY and Contact.State__c != 'Deceased')
" -r json > data/input.json

# Run out node command

node bin/export.js;
