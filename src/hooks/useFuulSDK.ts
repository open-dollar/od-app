import { Fuul } from '@fuul/sdk'
import { SiweMessage } from 'siwe'
import { useActiveWeb3React } from '~/hooks/useActiveWeb3React'

function useFuulSDK() {
    const { chainId, provider } = useActiveWeb3React()

    const fuulSendPageViewEvent = async (pageName: string) => {
        const response = await Fuul.sendPageview(pageName)
        return response
    }

    async function createSiweMessage(address: string, statement: string) {
        const scheme = window.location.protocol.slice(0, -1)
        const domain = window.location.host
        const origin = window.location.origin

        const message = new SiweMessage({
            scheme,
            domain,
            address,
            statement,
            uri: origin,
            version: '1',
            chainId: chainId,
        })
        return message.prepareMessage()
    }

    const sendConnectWalletEvent = async (walletAddress: string): Promise<void> => {
        const message = await createSiweMessage(
            walletAddress,
            `Sign to verify your address and access our points rewards program`
        )
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
