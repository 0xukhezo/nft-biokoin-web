const networkConfig = {
    31337: {
        name: "localhost",
        lendingPoolAddressesProvider:
            "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
        swapRouterAddress: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
        factoryAddress: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
        positionManagerAddress: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
        daiEthPriceFeed: "0x773616E4d11A78F511299002da57A0a94577F1f4",
        routerLiquidityAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        usdcEthPriceFeed: "0x986b5E1e1755e3C2440e960477f25201B0a8bbD4",
        wethToken: {
            address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            decimals: 18,
            symbol: "WETH",
            name: "Wrapped Ether",
        },
        usdcToken: {
            name: "USD Coin",
            symbol: "USDC",
            decimals: 6,
            address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        },
        uniToken: {
            name: "Uniswap Coin",
            symbol: "UNI",
            decimals: 18,
            address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
        },
        daiToken: {
            name: "DAI Coin",
            symbol: "DAI",
            decimals: 18,
            address: "0x6b175474e89094c44da98b954eedeac495271d0f",
        },
    },
    5: {
        name: "goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
        wethToken: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
        lendingPoolAddressesProvider:
            "0x5E52dEc931FFb32f609681B8438A51c675cc232d",
        daiEthPriceFeed: "0xb4c4a493AB6356497713A78FFA6c60FB53517c63",
        assets: {
            wethToken: {
                address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                decimals: 18,
                symbol: "WETH",
                name: "Wrapped Ether",
                image: "https://imgs.search.brave.com/ViNj_1mofY7uPUeZRBaPe0Zoo6MRwndpdS1xlSbS_k8/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93d3cu/Y3JpcHRvbW9uZWRh/cy5jby93cC1jb250/ZW50L3VwbG9hZHMv/MjAyMS8wMS9ldGhl/cmV1bS1ldGgtbG9n/by5wbmc",
            },
            usdcToken: {
                name: "USD Coin",
                symbol: "USDC",
                decimals: 6,
                address: "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C",
                image: "https://imgs.search.brave.com/ViNj_1mofY7uPUeZRBaPe0Zoo6MRwndpdS1xlSbS_k8/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93d3cu/Y3JpcHRvbW9uZWRh/cy5jby93cC1jb250/ZW50L3VwbG9hZHMv/MjAyMS8wMS9ldGhl/cmV1bS1ldGgtbG9n/by5wbmc",
            },
            uniToken: {
                name: "Uniswap Coin",
                symbol: "UNI",
                decimals: 18,
                address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
                image: "https://imgs.search.brave.com/VhEFIJt1STfCz2y4Nr_3DK7U0ya1aRd5kKJMfIrc_2E/rs:fit:1000:1000:1/g:ce/aHR0cHM6Ly9jZG4y/LmJpdHR1cmsuY29t/L2xvZ28vY3J5cHRv/L2ljb24tVU5JLnBu/Zw",
            },
            linkToken: {
                symbol: "LINK",
                image: "https://imgs.search.brave.com/_BmTurtVVT2Ei1ux7DRw1zXQ8ZLoc-eX9slXXjUZUpo/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9jcnlw/dG9sb2dvcy5jYy9s/b2dvcy9jaGFpbmxp/bmstbGluay1sb2dv/LnBuZw",
                id: "1",
                value: 1,
                address: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
                decimals: 18,
            },
        },
    },
}

module.exports = {
    networkConfig,
}
