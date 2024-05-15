import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useActiveWeb3React } from '~/hooks/useActiveWeb3React'
import useFuulSDK from '~/hooks/useFuulSDK'
import Button from '~/components/Button'
import CopyToClipboard from 'react-copy-to-clipboard'
import CopyIcon from '~/components/Icons/CopyIcon'

const Affiliate = () => {
    const { account } = useActiveWeb3React()
    const { createAffiliateCode, getAffiliateCode } = useFuulSDK()
    const [affiliateCode, setAffiliateCode] = useState<string>('')
    const [newAffiliateCode, setNewAffiliateCode] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const [hasFetched, setHasFetched] = useState<boolean>(false)

    useEffect(() => {
        if (account && !hasFetched) {
            setHasFetched(true)
            ;(async () => {
                try {
                    const code = await getAffiliateCode(account)
                    if (code) {
                        setAffiliateCode(code)
                    }
                } catch (err) {
                    console.error('Error fetching affiliate code:', err)
                }
            })()
        }
    }, [account, getAffiliateCode, hasFetched])

    const handleCreateAffiliateCode = async () => {
        if (account && newAffiliateCode) {
            try {
                await createAffiliateCode(account, newAffiliateCode)
                setAffiliateCode(newAffiliateCode)
                setNewAffiliateCode('')
                setError(null)
            } catch (err) {
                console.error('Error creating affiliate code:', err)
                setError((err as Error)?.message || 'Failed to create affiliate code. Please try again.')
            }
        }
    }

    return (
        <Container>
            <Content>
                <Title>Affiliate Program</Title>
                {affiliateCode ? (
                    <>
                        <AffiliateText>
                            Your Affiliate Code: <BoldText>{affiliateCode}</BoldText>
                        </AffiliateText>
                        <AffiliateText>
                            Your Affiliate Link: <BoldText>{`https://app.opendollar.com?af=${affiliateCode}`}</BoldText>
                        </AffiliateText>
                        <CopyToClipboard
                            text={`https://app.opendollar.com?af=${affiliateCode}`}
                            onCopy={() => {
                                setCopied(true)
                                setTimeout(() => setCopied(false), 1500)
                            }}
                        >
                            <Button>
                                {copied ? 'Copied!' : 'Copy Affiliate Link'}
                                <CopyIconContainer>
                                    <CopyIcon />
                                </CopyIconContainer>
                            </Button>
                        </CopyToClipboard>
                    </>
                ) : (
                    <>
                        <input
                            type="text"
                            placeholder="Enter new affiliate code"
                            value={newAffiliateCode}
                            onChange={(e) => setNewAffiliateCode(e.target.value)}
                        />
                        <Button onClick={handleCreateAffiliateCode} disabled={!account || !newAffiliateCode}>
                            {account ? 'Create Affiliate Code' : 'Wallet Disconnected'}
                        </Button>
                        {error && <ErrorMessage>{error}</ErrorMessage>}
                    </>
                )}
            </Content>
        </Container>
    )
}

export default Affiliate

const CopyIconContainer = styled.div`
    margin-left: 4px;
`

const AffiliateText = styled.div`
    font-size: ${(props) => props.theme.font.small};
    margin-bottom: 20px;
`

const BoldText = styled.span`
    font-weight: bold;
`

const Title = styled.h2`
    font-size: 40px;
    font-weight: 700;
    color: #1c293a;
    margin-bottom: 28px;
`

const Container = styled.div`
    padding: 30px 20px;
`

const Content = styled.div`
    max-width: fit-content;
    margin: 0 auto;
    text-align: center;

    h2 {
        margin-bottom: 20px;
    }

    input {
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        width: 100%;
    }
`

const ErrorMessage = styled.div`
    color: red;
    margin-top: 10px;
`
