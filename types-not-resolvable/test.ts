import * as Hapi from '@hapi/hapi';

async function test() {
    const server = Hapi.server({ port: 3000 });
    const res = await server.inject({ method: 'GET', url: '/' });
    // These should work with @types/hapi__hapi@20.0.x
    console.log(res.statusCode);
    console.log(res.headers);
    console.log(res.payload);
}
