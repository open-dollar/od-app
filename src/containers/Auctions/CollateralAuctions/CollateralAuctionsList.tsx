import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import Dropdown from '~/components/Dropdown'
import Loader from '~/components/Loader'
import Pagination from '~/components/Pagination'
import { SideLabel } from '~/containers/Vaults/CreateVault'
import { useCollateralAuctions } from '~/hooks'
import { useStoreState } from '~/store'
import { IPaging, getTokenLogo } from '~/utils'
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
        return { name: collateral.symbol, icon: getTokenLogo(collateral.symbol) }
    })

    const dropdownSelected = collateralsDropdown?.find((item) => item.name === selectedItem)!

    return (
        <Container>
            {collateralsDropdown && dropdownSelected && (
                <DropdownContainer>
                    <SideLabel>{`Select Collateral`}</SideLabel>
                    <Dropdown
                        items={collateralsDropdown!}
                        itemSelected={dropdownSelected!}
                        getSelectedItem={setSelectedItem}
                    />
                </DropdownContainer>
            )}
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
    padding: 10px 20px 30px 20px;
    border-radius: 15px;
    background: ${(props) => props.theme.colors.colorSecondary};
`

const NoData = styled.div`
    margin-bottom: 15px;
    text-align: center;
    font-size: ${(props) => props.theme.font.default};
    font-weight: 400;
    color: ${(props) => props.theme.colors.accent};
`
const DropdownContainer = styled.div`
    margin-bottom: 20px;
`
