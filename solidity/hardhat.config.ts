import '@nomiclabs/hardhat-ethers'
import { HardhatUserConfig } from 'hardhat/config'

const config: HardhatUserConfig = {
    solidity: {
        version: '0.8.13',
    },
    paths: {
        artifacts: '../src/artifacts',
    },
}

export default config
