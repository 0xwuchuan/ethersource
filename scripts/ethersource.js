const axios = require("axios").default;
const fs = require("fs");
const path = require("path");
require("dotenv").config();

/* 
Logic:
    Get Json Response from etherscan through API request
    Process Json result and output files using fs.writeFileSync() in the correct directories

However, there are two different types of verified source code
    1. Flattened contract (with multiple solidity files) eg. Goblintownwtf https://etherscan.io/address/0xbce3781ae7ca1a5e050bd9c4c77369867ebc307e#code 
        - Source code is a flattened file where its equally hard to read
        - @wuchuank To do: Unflatten the contracts and derive the correct paths based on imports

    2. Multiple contracts/files eg. Beanz https://etherscan.io/address/0x306b1ea3ecdf94ab739f1910bbda052ed4a9f949#code
       - Source code is separated into multiple files
       - Grab the paths of the multiple files and output the files accordingly
       - @wuchuank To do: Change the paths to fit the smart contracts relatively so the import statement does not output errors

@wuchuank To do: Support smart contracts that use libraries
*/

let apiUrl =
    "https://api.etherscan.io/api?module=contract&action=getsourcecode";
let apiKey = process.env.API_KEY;

let address = process.argv.slice(2)[0];

getContractJson(address);

async function getContractJson(address) {
    try {
        let request = `${apiUrl}&address=${address}&apikey=${apiKey}`;
        const response = await axios.get(request);
        const responseData = response.data;
        parseJson(responseData);
    } catch (err) {
        console.log(err);
    }
}

async function parseJson(json) {
    const result = json.result[0];

    let name = result.ContractName;

    let sourceCode = result.SourceCode;

    // Etherscan may return a json object in SourceCode if it is in multiple contracts/files, else sourceCode is the flattened file
    try {
        sourceCode = sourceCode.trim();
        // Remove outer {} to get a JSON string to parse
        if (sourceCode.startsWith("{{") && sourceCode.endsWith("}}")) {
            sourceCode = sourceCode.substring(1, sourceCode.length - 1);
            let sourceStruct = JSON.parse(sourceCode);

            let sourceFiles = sourceStruct.sources || sourceStruct;
            /*
            1. Create directories based on paths using fs.mkdir (extract path first from fileNames) [x]
            2. 
            */
            let fileNames = Object.keys(sourceFiles); // array of file paths

            fileNames.forEach((filePath) => {
                let directoryPath = path.join(
                    "build",
                    `${name}`,
                    path.dirname(filePath)
                );
                fs.mkdirSync(directoryPath, { recursive: true }, (err) => {
                    if (err) throw err;
                });

                fs.writeFileSync(
                    `./build/${name}/${filePath}`,
                    sourceFiles[filePath].content,
                    (err) => {
                        if (err) throw err;
                    }
                );
            });
        } else {
            // FLATTENED FILE
        }
        // To do: Include libraries
    } catch (e) {
        console.log(e);
    } finally {
        console.log(`${name} Created`);
    }
}
