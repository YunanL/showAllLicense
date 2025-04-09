let userAccount;

async function connectMetaMask() {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        userAccount = (await web3.eth.getAccounts())[0];
        document.getElementById("wallet-address").innerText = `Wallet: ${userAccount}`;
    } else {
        alert("Please install MetaMask!");
    }
}

async function loadNFTContracts() {
    if (!userAccount) {
        alert("Please connect MetaMask first!");
        return;
    }

    const nftListDiv = document.getElementById("nft-list");
    nftListDiv.innerHTML = "🔍 Loading NFT Contracts...";

    try {
        const covalentApiKey = "demo"; // replace with your Covalent API key for production use
        const chainId = 11155111; // Sepolia testnet, but Covalent might not fully support Sepolia — mainnet ID is 1

        const response = await fetch(`https://api.covalenthq.com/v1/${chainId}/address/${userAccount}/balances_v2/?nft=true&no-nft-fetch=false&key=${covalentApiKey}`);
        const data = await response.json();

        if (!data.data || !data.data.items) {
            nftListDiv.innerHTML = "❌ No NFTs found or unsupported network.";
            return;
        }

        const nftContracts = data.data.items.filter(item => item.type === "nft" && item.contract_address);

        if (nftContracts.length === 0) {
            nftListDiv.innerHTML = "❌ No NFT contracts found.";
            return;
        }

        nftListDiv.innerHTML = "<h3>NFT Contract Addresses:</h3>";
        nftContracts.forEach(nft => {
            nftListDiv.innerHTML += `<p>${nft.contract_address}</p>`;
        });

    } catch (error) {
        console.error("Error loading NFTs:", error);
        nftListDiv.innerHTML = "❌ Error loading NFT contract addresses.";
    }
}
