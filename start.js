// =================================================================================================
// LICENSE.txt
// =================================================================================================
//
// Author: JD @ SpotADev
// Date:   28th Sept 2022
//
// License:
//  
//     You can do what you want with this software but at your own risk.  You can modify it. You
//     can sell it.   You can mess it up.  You can improve it.  Do what you want with it.  I accept 
//     no liability for what you do with this software.   Enjoy!
//
//
// =================================================================================================
// Overview of this software
// =================================================================================================
// 
// Please read README.md - it has more details than in this comment.
//
// This software uses npm and node to publish a website to web3.storage and map it to an existing 
// or new IPNS id.  The IPNS id can be shared with others to access the published website.
//
// Alternatively the IPNS id and a IPFS node gateway can then be mapped to a conventional domain.
// 
// In this scenario a url like:
// 
//     https://ipfs.io/ipfs/QmYNQJoKGNHTpPxCBPh9KkDpaExgd2duMa3aF6ytMpHdao/files/index.html
//  
// can be mapped to:
// 
//     yourdomain.com
// 
// Note that in the above example, ipfs.io is a gateway.
// 
// The IPNS id is:
// 
//     QmYNQJoKGNHTpPxCBPh9KkDpaExgd2duMa3aF6ytMpHdao
// 
// You could run your own gateway / cloud node instead of using ipfs.io as the gateway.
// 
// However not all browsers need a gateway in the url. The Brave browser can deal with the IPFS id 
// or IPNS id direct. For more details see
// 
//      https://brave.com/brave-integrates-ipfs/     
//
// 
// =================================================================================================
// Instructions
// =================================================================================================
//
// (i) Create a directory called files at the same level as this index.js file and put your website 
// files in it including an index.html
//
// (ii) Create a file in the same directory as this file called:
//
//     env.properties
//
// Inside add a property:
//
//     token=do_not_share
//
// (iii) If you have not already done to go and register on web3.storage and get a token. 
// Replace do_not_share above with the token you were given.  Do not share this token with everyone
// Infact environment.properties is in .gitignore so you do not accidentally push it to git.
//
// (iv) To build:
// 
//     npm install
//
// (v) To run:
//
//     npm run publish
//
// or:
//     node start.js
//
// When that you run the above you  will see the IPNS hash written in the console.  
//
// If you then want to map this to a domain follow instructions at:
//
//    https://medium.com/coinmonks/how-to-host-a-website-on-ipfs-with-dns-82f1f2fe6361
//
// NOTE: The first time you publish your website it creates a file called:
//
//     ipnskey.txt
//
// If you want to start over with a new IPNS cid you will need to delete this ipnskey.txt file.
//
// =================================================================================================

import { Web3Storage, getFilesFromPath } from 'web3.storage';
import * as Name from 'w3name';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import PropertiesReader from 'properties-reader';

async function publish () {

    const properties = PropertiesReader( 'env.properties' );
    
    // Find location of where this start.js script resides
    const __filename = fileURLToPath( import.meta.url );
    const __dirname = path.dirname( __filename );
    console.log( '__dirname: ' + __dirname );
    
    // location of the files we wish to publish to IPFS
    const filesToPublishDir = __dirname + "/files";
    
    // location of file where we save the key for the IPNS
    const ipnsKeyFileName = __dirname + "/ipnskey.txt";
    
    // Read the files we want to publish from the files directory
    const files = []
    const pathFiles = await getFilesFromPath( filesToPublishDir );
    files.push( ...pathFiles );
    
    // Read the token which was in env.properties
    const token = properties.get( 'token' );
    
    // Initialize web storage
    const storage = new Web3Storage({ token });
    
    // Upload files and get the IPFS cid
    // Note that if wrapWithDirectory = true it creates a virtual directory called files which 
    // needs to be specified in the path of the ipfs / ipns resource
    console.log(`Uploading ${files.length} files`);
    const cid = await storage.put( files, { wrapWithDirectory : true } );
    console.log( 'Content added with CID:', cid );
    
    // Check the status of the files we just added
    const info = await storage.status( cid );
    console.log( info );
    
    let revision = null;
    let ipnsCid = null;
    let ipnsName = null;
    
    // Check if ipnskey.txt exists.  If it does we will read the IPNS from it. Else we create a
    // new IPNS and save it to ipnskey.txt
    if ( fs.existsSync( ipnsKeyFileName ) ) {
    
        // Reading bytes of private key IPNS name details from the file system
        const bytes = await fs.promises.readFile(ipnsKeyFileName);
        
        // Converting bytes to the IPNS name
        ipnsName = await Name.from( bytes );
        
        // Getting exiting revision info
        revision = await Name.resolve( ipnsName );
        console.log( 'Resolved revision value:', revision.value );
        
        // Incrementing revision.  Connecting revision to new content CID
        revision = await Name.increment(revision, cid );
        ipnsCid = ipnsName.toString();
    } 
    else {     
        ipnsName = await Name.create();
        const keyBytes = ipnsName.key.bytes;
        ipnsCid = ipnsName.toString();
        const keyOutputFilename = "ipns_key_" + ipnsCid + '.txt';
        await fs.promises.writeFile( ipnsKeyFileName, keyBytes );
        
        console.log( 'Wrote private key to: ' + keyOutputFilename + 
            ".  You need this key for republishing this IPNS resource");
        
        // Add ipfs in front of the cid
        const ipfsIdOfFilesAdded = '/ipfs/' + cid;
        
        // Create the first revision
        revision = await Name.v0( ipnsName, ipfsIdOfFilesAdded ) ;
    }
    
    console.log( 'IPNS id: ', ipnsCid );
    
    // publish the IPNS resource
    console.log( 'About to publish resource. Be patient' );
    await Name.publish( revision, ipnsName.key ); 
    console.log( 'Published resource with IPNS id: ' + ipnsCid );
    console.log( 'Try these urls:' );
    console.log( 'https://ipfs.io/ipns/' + ipnsCid );
    console.log( 'https://ipfs.io/ipns/' + ipnsCid + '/files/<your-file-name>' );
}

publish();