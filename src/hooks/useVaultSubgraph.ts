import { useEffect, useState } from 'react'

const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/52770/open-dollar---mainnet/v1.8.0-rc.1'

const postQuery = async (query: string, variables: any) => {
    return fetch(SUBGRAPH_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    })
        .then((r) => r.json())
        .then((data) => {
            return data
        })
}

export type VaultDetails = {
    id: string
    owner: string
    collateral: string
    debt: string
    collateralType: string
}

export const fetchAllVaults = async () => {
    const data = await postQuery(
        `
        query AllUsers {
            vaults(first:1000) {
                id
                owner
                collateral
                debt
                collateralType
            }
        }`,
        {}
    )

    let owners: string[] = []
    let vaultsByOwner: { [key: string]: string[] } = {}
    let vaultsByCollateral: { [key: string]: string[] } = {}
    data.data.vaults.map((vault: VaultDetails) => {
        if (!owners.includes(vault.owner)) owners.push(vault.owner)
        if (!vaultsByOwner[vault.owner]) vaultsByOwner[vault.owner] = []
        vaultsByOwner[vault.owner].push(vault.id)
        if (!vaultsByCollateral[vault.collateralType]) vaultsByCollateral[vault.collateralType] = []
        vaultsByCollateral[vault.collateralType].push(vault.id)
        return vault
    })
    const details = {
        vaults: data.data.vaults,
        owners,
        vaultsByOwner,
        vaultsByCollateral,
    }

    return details
}

export const useVaultSubgraph = () => {
    const [vaults, setVaults] = useState({ vaults: [] })

    const getVaults = async () => {
        const allVaults = await fetchAllVaults()
        setVaults(allVaults)
    }

    useEffect(() => {
        getVaults()
    }, [])

    return vaults
}
