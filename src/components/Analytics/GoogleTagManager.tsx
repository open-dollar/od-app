import React from 'react'
import { Helmet } from 'react-helmet-async'
import { RouteComponentProps } from 'react-router-dom'

const GoogleTagManager = ({ location: { pathname } }: RouteComponentProps) => {
    return (
        <Helmet>
            {process.env.REACT_APP_GOOGLE_ANALYTICS_ID ? (
                <script
                    async
                    src={`https://www.googletagmanager.com/gtag/js?id=${process.env.REACT_APP_GOOGLE_ANALYTICS_ID}`}
                />
            ) : null}
            {process.env.REACT_APP_GOOGLE_ANALYTICS_ID ? (
                <script>
                    {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
      
        gtag('config', '${process.env.REACT_APP_GOOGLE_ANALYTICS_ID}', {'page_path': '${pathname}'});
      `}
                </script>
            ) : null}
        </Helmet>
    )
}

export default GoogleTagManager
