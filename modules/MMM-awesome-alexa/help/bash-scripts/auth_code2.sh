CLIENT_ID="amzn1.application-oa2-client.64b783a057104700b89a37b5f5a2dc11"
CLIENT_SECRET="48cca45c1a41d900da8a1c72d031e1add961e73a4fd881405630eac4dd54796a"
CODE="ANguNkuflByoYjaRgPtO"
GRANT_TYPE="authorization_code"
REDIRECT_URI="https://magic-mirror-avs.github.io/Alexa-Web-Helper/authresponse"

curl -X POST --data "grant_type=${GRANT_TYPE}&code=${CODE}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}" https://api.amazon.com/auth/o2/token