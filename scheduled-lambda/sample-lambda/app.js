const AWS = require('aws-sdk')
const axios = require('axios')

let binresponse;

exports.lambda_handler = async(event, context) => {
    let tableName;
    if (process.env.TABLE_NAME && process.env.TABLE_NAME === 'SampleTable') {
        tableName = 'simple-table-stg'
    }
    else {
        tableName = process.env.TABLE_NAME || 'simple-table-stg'
    }

    const aws_region = process.env.AWS_REGION || 'us-west-2'
    try {
        binresponse = await axios.get('https://httpbin.org/ip');
        // console.log(binresponse);
    }
    catch (error) {
        console.log(error);
        return error
    }
    const docClient = new AWS.DynamoDB.DocumentClient({ 'region': aws_region });
    const params = generateParams(tableName, binresponse.data.origin)
    console.log(params)
    const dbevent = await insertEvent(docClient, params)

    return JSON.stringify(dbevent, null, 2)
    // return dbevent
}



function insertEvent(docClient, params) {
    return new Promise((resolve, reject) => {
        docClient.put(params, function(err, data) {
            if (err) {
                console.log("Unable to add items. Error:", err);
                reject(err);
            }
            else {
                console.log("Successfully added items:", JSON.stringify(data, null, 2));
                resolve(data)
            }
        });
    })
}


function generateParams(tableName, ip) {
    const datetimeiso = new Date().toISOString()
    const params = {
        Item: {
            "event_time": datetimeiso,
            "ip": ip
        },
        ReturnConsumedCapacity: "TOTAL",
        TableName: tableName
    };

    return params
}
