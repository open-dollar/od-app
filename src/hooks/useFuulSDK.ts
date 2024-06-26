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
            `Sign in with Ethereum to Open Dollar and agree to the Terms of Service at opendollar.com/terms and fuul.xyz/terms/users`
        )
        const signature = await provider?.getSigner().signMessage(message)
        return await Fuul.sendConnectWallet({
            address: walletAddress,
            signature,
            message,
        })
    }

    const createAffiliateCode = async (walletAddress: string, affiliateCode: string): Promise<void> => {
        // DO NOT CHANGE THIS MESSAGE - THIS MESSAGE MUST MATCH EXACTLY OR THE SIGNATURE WILL FAIL
        const message = `I confirm that I am creating the ${affiliateCode} code on Fuul`
        const signature = await provider?.getSigner().signMessage(message)
        if (!signature) {
            throw new Error('Failed to sign message')
        }
        return await Fuul.createAffiliateCode(walletAddress, affiliateCode, signature)
    }

    const getAffiliateCode = async (walletAddress: string): Promise<string | null> => {
        try {
            return await Fuul.getAffiliateCode(walletAddress)
        } catch (error) {
            console.debug('No affiliate code found:', error)
            return null
        }
    }

    const getUserData = async (user_address: string): Promise<any | null> => {
        try {
            const data = await Fuul.getPointsLeaderboard({ user_address })
            const results = data?.results[0]
            if (!results) {
                return {
                    points: '0 🔩',
                    rank: 0,
                }
            }
            return {
                points: `${parseInt(results.total_amount).toLocaleString()} 🔩`,
                rank: `#${results.rank}`,
            }
        } catch (error) {
            console.debug('No user data found:', error)
            return null
        }
    }

    return {
        Fuul,
        fuulSendPageViewEvent,
        sendConnectWalletEvent,
        createAffiliateCode,
        getAffiliateCode,
        getUserData,
    }
}

export default useFuulSDK
