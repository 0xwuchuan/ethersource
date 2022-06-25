import beanzJson from "./json/beanz.json";
import goblinJson from "./json/goblin.json";

/* 
There are two different types of verified source code
    1. Flattened contract (with multiple solidity files) eg. Goblintownwtf https://etherscan.io/address/0xbce3781ae7ca1a5e050bd9c4c77369867ebc307e#code 
    2. Multiple contracts/files eg. Beanz https://etherscan.io/address/0x306b1ea3ecdf94ab739f1910bbda052ed4a9f949#code
*/

/*
Logic:
    Get Json Response from etherscan through API request
    Process Json result and output files using fs.writeFileSync() in the correct directories
*/

async function parseJson(json: any) {
    // Can add interface for json type
    const result = json.result[0];

    let sourceCode = result.SourceCode;

    // Etherscan may return a json object in SourceCode if it is in multiple contracts/files, else sourceCode is the flattened file
    try {
        sourceCode = sourceCode.trim();
        // Remove outer {} to get a JSON string to parse
        if (sourceCode.startsWith("{{") && sourceCode.endsWith("}}")) {
            sourceCode = sourceCode.substring(1, sourceCode.length - 1);
        }
        let sourceStruct = JSON.parse(sourceCode);
        // To do: Include libraries
        let sourceFiles = sourceStruct.sources || sourceStruct;
        let fileNames = Object.keys(sourceFiles);

        sourceCode = fileNames.reduce((result, currentFile) => {
            return result + sourceFiles[currentFile].content;
        });
    } catch (e) {
        //not json; print results
        console.log(e);
    }

    console.log(sourceCode);
}

parseJson(beanzJson);
