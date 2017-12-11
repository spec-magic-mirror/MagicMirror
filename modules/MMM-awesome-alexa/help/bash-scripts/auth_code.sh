CLIENT_ID="amzn1.application-oa2-client.64b783a057104700b89a37b5f5a2dc11"
DEVICE_TYPE_ID="ReflectiveHealth"
DEVICE_SERIAL_NUMBER=123
REDIRECT_URI="https://magic-mirror-avs.github.io/Alexa-Web-Helper/authresponse"
RESPONSE_TYPE="code"
SCOPE="alexa:all"
SCOPE_DATA="{\"alexa:all\": {\"productID\": \"$DEVICE_TYPE_ID\", \"productInstanceAttributes\": {\"deviceSerialNumber\": \"${DEVICE_SERIAL_NUMBER}\"}}}"

function urlencode() {
  perl -MURI::Escape -ne 'chomp;print uri_escape($_),"\n"'
}

AUTH_URL="https://www.amazon.com/ap/oa?client_id=${CLIENT_ID}&scope=$(echo $SCOPE | urlencode)&scope_data=$(echo $SCOPE_DATA | urlencode)&response_type=${RESPONSE_TYPE}&redirect_uri=$(echo $REDIRECT_URI | urlencode)"

open ${AUTH_URL}