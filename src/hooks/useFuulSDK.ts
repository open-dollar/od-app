import { Fuul } from '@fuul/sdk'
import { useWeb3React } from '@web3-react/core'

function useFuulSDK() {
    const { provider } = useWeb3React()

    const fuulSendPageViewEvent = async (pageName: string) => {
        const response = await Fuul.sendPageview(pageName)
        return response
    }

    const sendConnectWalletEvent = async (walletAddress: string): Promise<void> => {
        const time = new Date().toDateString()
        const message = `Sign to verify your address and access our points rewards program ${time}`
        const signature = await provider?.getSigner().signMessage(message)
        return await Fuul.sendConnectWallet({
            address: walletAddress,
            signature,
            message,
        })
    }

    return {
        Fuul,
        fuulSendPageViewEvent,
        sendConnectWalletEvent,
    }
}

export default useFuulSDK
