import React, { ReactNode } from 'react'
import Maintenance from '~/containers/Maintenance'

interface Props {
    children: ReactNode
}

const MaintenanceRedirect = ({ children }: Props) => {
    if (process.env.REACT_APP_IS_IN_MAINTENANCE_MODE === 'true') {
        return <Maintenance />
    }
    return <>{children}</>
}

export default MaintenanceRedirect
