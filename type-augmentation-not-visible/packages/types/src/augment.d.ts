import '@hapi/hapi';

declare module '@hapi/hapi' {
    interface AuthCredentials {
        isMCPClient?: boolean;
    }
}
