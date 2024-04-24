import { NextRequest, NextResponse } from 'next/server'
import { get } from '@vercel/edge-config'

const PUBLIC_FILE = /\.(.*)$/;

export const config = {
    matcher: '/((?!api|_next|static|public|favicon.ico).*)'
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    if (
        PUBLIC_FILE.test(pathname) // Exclude public files
    )
        return NextResponse.next();

    if (!process.env.EDGE_CONFIG) {
        req.nextUrl.pathname = `/missing-edge-config`
        return NextResponse.redirect(req.nextUrl)
    }

    try {
        // Check whether the maintenance page should be shown
        const isInMaintenanceMode = await get<boolean>('isInMaintenanceMode')

        // If is in maintenance mode, point the url pathname to the maintenance page
        if (isInMaintenanceMode) {
            req.nextUrl.pathname = `/maintenance`

            // Rewrite to the url
            return NextResponse.redirect(req.nextUrl)
        }
    } catch (error) {
        // show the default page if EDGE_CONFIG env var is missing,
        // but log the error to the console
        console.error(error)
    }
}
