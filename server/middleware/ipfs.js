import { create, urlSource } from 'ipfs-http-client';

async function ipfsClient(){
const ipfs = await create({
        host: "ipfs.infura.io",
        port: "5001",
        protocol:"https"
    });
    return ipfs
}

async function saveFile(){
    
    let ipfs = await ipfsClient();
    
    let url = 'https://www.svnit.ac.in/qlinks/Academic%20calendar%202021-22.pdf';
    let result = await ipfs.add(urlSource(url));
    
    console.log(result);
    
}

saveFile();
