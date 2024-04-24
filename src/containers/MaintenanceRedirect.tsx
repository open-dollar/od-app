import React, {ReactNode} from 'react'
import { Redirect } from 'react-router-dom'

interface Props {
    children: ReactNode
}

const MaintenanceRedirect = ({ children }: Props) => {
    if (process.env.REACT_APP_IS_IN_MAINTENANCE_MODE === 'true') {
        return <Redirect to="/maintenance" />
    }
    return <>{children}</>
}

export default MaintenanceRedirect