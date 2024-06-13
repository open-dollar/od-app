import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useActiveWeb3React } from '~/hooks/useActiveWeb3React'
import { useStoreActions } from '~/store'

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

    const { popupsModel: popupsActions } = useStoreActions((state) => state)
    const handleConnectWallet = () => popupsActions.setIsConnectorsWalletOpen(true)

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
                    console.error('Error fetching referral code:', err)
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
                console.error('Error creating referral code:', err)
                setError((err as Error)?.message || 'Failed to create referral code. Please try again.')
            }
        }
    }

    return (
        <Container>
            <Content>
                {affiliateCode ? (
                    <>
                        <FlexContainer>
                            <AffiliateText>
                                Your Referral Link:{' '}
                                <BoldText>{`https://app.opendollar.com?af=${affiliateCode}`}</BoldText>
                            </AffiliateText>
                        </FlexContainer>
                        <CopyToClipboard
                            text={`https://app.opendollar.com?af=${affiliateCode}`}
                            onCopy={() => {
                                setCopied(true)
                                setTimeout(() => setCopied(false), 1500)
                            }}
                        >
                            <BtnWrapper>
                                <Button secondary>
                                    {copied ? 'Copied!' : 'Copy'}
                                    <CopyIconContainer>
                                        <CopyIcon />
                                    </CopyIconContainer>
                                </Button>
                            </BtnWrapper>
                        </CopyToClipboard>
                    </>
                ) : (
                    <>
                        <FlexContainer>
                            <UrlText>https://app.opendollar.com?af=</UrlText>
                            <input
                                type="text"
                                placeholder="Your new referral code"
                                value={newAffiliateCode}
                                onChange={(e) => setNewAffiliateCode(e.target.value)}
                            />
                        </FlexContainer>
                        <BtnWrapper>
                            {account ? (
                                <Button secondary onClick={handleCreateAffiliateCode} disabled={!newAffiliateCode}>
                                    Create Referral Link
                                </Button>
                            ) : (
                                <Button secondary onClick={handleConnectWallet}>
                                    Connect Wallet
                                </Button>
                            )}
                        </BtnWrapper>

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
    display: flex;
    justify-content: space-between;
    font-style: italic;
    font-size: ${(props) => props.theme.font.small};
`

const Container = styled.div`
    background-color: rgba(0, 0, 0, 0.02);
    backdrop-filter: blur(10px);

    border: 1px solid rgba(255, 255, 255, 0);
    border-radius: 3px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

    display: flex;
    justify-content: flex-start;
    margin-top: 20px;
    padding: 20px;
    border-radius: 5px;
    width: 100%;

    @media (max-width: 767px) {
        justify-content: center;
    }
`

const Content = styled.div`
    display: flex;
    align-items: center;
    column-gap: 10px;

    input {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        width: 100%;
    }
    @media (max-width: 767px) {
        flex-direction: column;
        row-gap: 20px;
    }
`

const FlexContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 59px;

    input {
        flex-grow: 1;
    }

    @media (max-width: 767px) {
        flex-direction: column; /* Stack elements vertically */
        align-items: flex-start;
    }
`

const UrlText = styled.div`
    text-wrap: nowrap;
    font-style: italic;
    font-size: ${(props) => props.theme.font.small};
`
const BoldText = styled.span`
    margin-left: 10px;
    margin-right: 10px;
    font-weight: bold;
    font-size: ${(props) => props.theme.font.small};
`

const ErrorMessage = styled.div`
    color: red;
    margin-top: 10px;
`

const BtnWrapper = styled.div`
    width: max-content;
    margin-right: auto;
    button {
        height: 49px;
        text-transform: uppercase;
        font-weight: 700;
        font-size: 18px;
        display: flex;
        width: 280px;
    }
`
