// Importing EdgeConfig if you are using it to get configurations
import { get } from '@vercel/edge-config';

// Type declarations for standard web APIs
interface EdgeRequest extends Request {
    nextUrl: URL;
}

const PUBLIC_FILE = /\.(png|jpe?g|gif|css|js|svg|ico|map|json)$/i;

export default async function middleware(req: EdgeRequest) {
    const url = new URL(req.url);

    // Skip middleware for asset requests
    if (PUBLIC_FILE.test(url.pathname)) {
        return new Response(null, { headers: { 'x-middleware-next': '1' } });
    }

    // Check if EDGE_CONFIG is available
    if (!process.env.EDGE_CONFIG) {
        url.pathname = `/missing-edge-config`;
        return Response.redirect(url, 307);
    }

    try {
        // Check whether the maintenance page should be shown
        const isInMaintenanceMode = await get<boolean>('isInMaintenanceMode');

        if (isInMaintenanceMode) {
            // If in maintenance mode, point the url pathname to the maintenance page
            url.pathname = `/maintenance`;
            return Response.redirect(url, 307);
        }
    } catch (error) {
        console.error('Error processing middleware:', error);
        // Continue to the default page but log the error
        return new Response(null, { headers: { 'x-middleware-next': '1' } });
    }

    // Continue with the normal flow if not in maintenance mode
    return new Response(null, { headers: { 'x-middleware-next': '1' } });
}