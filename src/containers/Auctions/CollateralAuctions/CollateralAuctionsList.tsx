import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import Dropdown from '~/components/Dropdown'
import Loader from '~/components/Loader'
import Pagination from '~/components/Pagination'
import { SideLabel } from '~/containers/Safes/CreateSafe'
import { useCollateralAuctions } from '~/hooks'
import { useStoreState } from '~/store'
import { IPaging, TOKEN_LOGOS } from '~/utils'
import CollateralAuctionBlock from './CollateralAuctionBlock'

export type Item = {
    name: string
    icon: string
    symbol: string
    href?: string
    isExternal?: boolean
    [U: string]: boolean | number | string | undefined
}

interface Props {
    selectedItem: string
    setSelectedItem: (item: string) => void
}
const CollateralAuctionsList = ({ selectedItem, setSelectedItem }: Props) => {
    const { t } = useTranslation()
    const [paging, setPaging] = useState<IPaging>({ from: 0, to: 5 })

    const { connectWalletModel: connectWalletState } = useStoreState((state) => state)

    const { tokensData } = connectWalletState

    // auctions list
    const auctions = useCollateralAuctions(selectedItem)

    const collaterals = tokensData && Object.values(tokensData).filter((token) => token.isCollateral)
    const collateralsDropdown = collaterals?.map((collateral) => {
        return { name: collateral.symbol, icon: TOKEN_LOGOS[collateral.symbol] }
    })

    const dropdownSelected = collateralsDropdown?.find((item) => item.name === selectedItem)!

    return (
        <Container>
            {collateralsDropdown && dropdownSelected && (
                <DropdownContainer>
                    <SideLabel>{`Select Collateral Type`}</SideLabel>
                    <Dropdown
                        items={collateralsDropdown!}
                        itemSelected={dropdownSelected!}
                        getSelectedItem={setSelectedItem}
                    />
                </DropdownContainer>
            )}
            <InfoBox>
                <Box>
                    <Title>Collateral Auctions</Title>
                </Box>
            </InfoBox>
            {!auctions ? (
                <Loader text="Loading..." />
            ) : auctions.length > 0 ? (
                <>
                    {auctions.slice(paging.from, paging.to).map((auction, i: number) => (
                        <CollateralAuctionBlock key={auction.auctionId} {...{ ...auction, isCollapsed: i !== 0 }} />
                    ))}
                    <Pagination items={auctions} perPage={5} handlePagingMargin={setPaging} />
                </>
            ) : (
                <NoData>
                    {t('no_auctions', {
                        type: 'Collateral',
                    })}
                </NoData>
            )}
        </Container>
    )
}

export default CollateralAuctionsList

const Container = styled.div`
    margin-top: 40px;
    padding: 30px 20px;
    border-radius: 15px;
    background: ${(props) => props.theme.colors.colorSecondary};
`

const Title = styled.div`
    font-size: ${(props) => props.theme.font.default};
    font-weight: bold;
    text-transform: capitalize !important;
`

const Box = styled.div`
    display: flex;
    align-items: center;
`

const InfoBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    button {
        min-width: 100px;
        padding: 4px 12px;
        margin-left: 30px;
    }
    margin-bottom: 20px;
    span {
        margin-right: 20px;
        font-size: 12px;
    }
`

const NoData = styled.div`
    border-radius: 15px;
    margin-bottom: 15px;
    background: ${(props) => props.theme.colors.background};
    padding: 2rem 20px;
    text-align: center;
    font-size: ${(props) => props.theme.font.small};
`
const DropdownContainer = styled.div`
    margin-bottom: 20px;
`
