import { Helmet } from 'react-helmet-async'
import { MetaInfo } from '~/utils/metaInfo'

interface MetaTagsProps {
    page: MetaInfo
}

const MetaTags: React.FC<MetaTagsProps> = ({ page }) => {
    const { title, description, keywords } = page
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
        </Helmet>
    )
}

export default MetaTags
