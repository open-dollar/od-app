import { useWeb3React } from '@web3-react/core'

import { getEtherscanLink, returnWalletAddress } from '~/utils'
import {
    Container,
    Content,
    Head,
    Header,
    Heads,
    HeadsContainer,
    LeftAucInfo,
    Link,
    List,
    ListItem,
    ListItemLabel,
    SectionContent,
    TableProps,
} from './DataTable'

export const ContractsTable = ({ title, colums, rows }: TableProps) => {
    const { chainId } = useWeb3React()
    return (
        <Container>
            <Header>
                <LeftAucInfo>
                    {/* Temporary title style */}
                    {/* <img src={Icon} alt="auction" /> */}
                    <h1 className="text-egg font-semibold font-poppins text-3xl"> {title}</h1>
                </LeftAucInfo>
            </Header>
            <Content>
                <SectionContent>
                    <Heads>
                        {colums?.map((colName, index) => (
                            <HeadsContainer key={title + '-column-' + index}>
                                <Head>{colName}</Head>
                            </HeadsContainer>
                        ))}
                    </Heads>

                    {rows?.map((item, index) => (
                        <List key={'row-' + index}>
                            {item?.map((value, valueIndex) => (
                                <HeadsContainer key={'row-item-' + valueIndex}>
                                    <ListItem>
                                        <ListItemLabel>{colums[valueIndex]}</ListItemLabel>
                                        {valueIndex !== 0 && (
                                            <Link
                                                href={getEtherscanLink(chainId || 420, value, 'address')}
                                                target="_blank"
                                            >
                                                {returnWalletAddress(value)}
                                            </Link>
                                        )}
                                        {valueIndex === 0 && <>{value}</>}
                                    </ListItem>
                                </HeadsContainer>
                            ))}
                        </List>
                    ))}
                </SectionContent>
            </Content>
        </Container>
    )
}
