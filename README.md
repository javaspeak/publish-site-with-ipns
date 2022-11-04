# web3.storage-publish-site-with-ipns
Welcome Everyone!

## Overview of this software

This software uses npm and node to publish a website to web3.storage and map it to an existing or new IPNS id. The IPNS id can be shared with others to access the published website.  

Alternatively the IPNS id and a IPFS node gateway can then be mapped to a conventional domain.

In this scenario a url like:  

     https://ipfs.io/ipns/QmYNQJoKGNHTpPxCBPh9KkDpaExgd2duMa3aF6ytMpHdao/files/a.html
     
can be mapped to:

    yourdomain.com

Note that in the above example, ipfs.io is a gateway. 

The IPNS id is:

    QmYNQJoKGNHTpPxCBPh9KkDpaExgd2duMa3aF6ytMpHdao
    
You could run your own gateway / cloud node instead of using ipfs.io as the gateway.

However not all browsers need a gateway in the url.  The Brave browser can deal with the IPFS id or
IPNS id direct:

     https://brave.com/brave-integrates-ipfs/     


## LICENSE

Author: JD @ SpotADev

Date:   29th September 2022

No liability is accepted for what you do with this software.   You can do what you want with this 
software but at your own risk.  You can run it. You can modify it. You can sell it. You can mash 
it up. You can improve it.  Do what you want with it.  Enjoy!


## Overview of IPFS / IPNS

IPFS is a decentralized solution for storing files on the internet.

When you upload files to IPFS you get a cid.

You can then generate an IPNS id, associate it with the upload cid and publish that IPNS resource.
If others need to access the files you uploaded then you give them the ipns id.

If you change a file the idea is you upload it again and get a different cid.  You then associate
it with the same IPNS id you used before.

This means that you can share the IPNS id and your users do not need to have a different id every
time you modify the content and upload it again.


## Overview of web3.storage

web3.storage is built on top of IPFS and FileCoin.

This example uses apis provided by web3.storage.

FileCoin is a crypto designed to pay distributed storage providers with crypto in return for hosting
files on IPFS.

If you go to:

    http://web3.storage

you can sign up and you will be issued with a token that allows you to upload 1TB of data for free.
I think this 1TB of data is like a promotion to get people to use the service.

The web3.storage has client code which you can call from javascript to publish your files.


## IPFS Gateways

In the IPFS eco system you can run an IPFS node written in GO or JavaScript.  You can even run
an IPFS node in your browser although it will not have access to transports like TCP, UDP.

It is possible to assign a conventional domain name to an IPFS node.

So the gateway could have a domain like:

     https://ipfs.io
     
The gateway nodes can provide a restful API to access a resource with its cid or IPNS id:

     https://ipfs.io/ipfs/QmYNQJoKGNHTpPxCBPh9KkDpaExgd2duMa3aF6ytMpHdao/files/a.html
     

## Mapping the IPNS id to a conventional domain name

You can map the gateway and IPFS cid to a domain using:

    CNAME 
    
and:

    TXT record    

For more details:

    https://medium.com/coinmonks/how-to-host-a-website-on-ipfs-with-dns-82f1f2fe6361


## Instructions

1. Create a directory called files at the same level as this index.js file and put your website 
files in it.   Note that an entry in .gitignore stops you accidentally adding your files to git.

2. Create a file in the same directory as this README.md called:

    env.properties

Inside add a property:

    token=do_not_share

3. If you have not already done to go and register on web3.storage and get a token. 
Replace do_not_share above with the token you were given.  Do not share this token with everyone
Infact environment.properties is in .gitignore so you do not accidentally push it to git.

4. To build:

    npm install

5. To run:

    npm run publish

or:
    
    node start.js
    
When that you run the above you  will see the IPNS hash written in the console.  

If you then want to map this to a domain follow instructions at:

    https://medium.com/coinmonks/how-to-host-a-website-on-ipfs-with-dns-82f1f2fe6361
    
NOTE: 

The first time you publish your website it creates a file called:

    ipnskey.txt

If you want to start over with a new IPNS cid you will need to delete this ipnskey.txt file.
    

## Conclusion

If you are interested in collaborating in other projects doing quite pioneering stuff, raise a 
ticket with your contact details.  We will then connect on zoom desktop (with a contact request).

These projects use technologies such as:

    * IPFS
    * IPNS
    * Web3 Storage
    * OrbitDb
    * Chrome Extensions
    * Java / Spring Boot / ORM / JPA
    * Angular / ReactJs / NodeJS
    * Selenium
    * AI / News Analytics
    
In the future we will integrate with Block Chain Ledger tech and other equivalents such as 
Hedera Hash Graph.

So if you are interested in any of the above techs you can get involved and add that experience
to your CV.  For example you can build up your JavaScript / NodeJS experience while at the same 
time getting your foot stuck into decentralised technologies.

