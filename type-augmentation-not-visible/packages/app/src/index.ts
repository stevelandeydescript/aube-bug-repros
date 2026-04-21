import '@repro/types';
import * as Hapi from '@hapi/hapi';

const server = Hapi.server({ port: 3000 });

server.route({
    method: 'GET',
    path: '/',
    handler(request) {
        // This should typecheck if the augmentation from @repro/types is visible.
        // With pnpm, @hapi/hapi resolves to a single hoisted copy, so the
        // augmentation merges correctly.
        // With aube's virtual store, each package gets its own isolated
        // @hapi/hapi, so the augmentation targets a different module identity
        // and is not visible here.
        const isMCP: boolean | undefined = request.auth.credentials.isMCPClient;
        return { isMCP };
    },
});
