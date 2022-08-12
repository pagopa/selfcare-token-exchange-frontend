const regexReplace = require('regex-replace');

//TODO: fix bug in @pagopa/openapi-codegen-ts that doesn't manage correctly 3xx
regexReplace(
  /("responses": *{[\s]*"30)/gi,
  `"responses": {
    "200": {
      "description": "OK"
    },
    "30`,
  'openApi/generated/dashboard-swagger20.json',
  { fileContentsOnly: true }
);
