// @ts-ignore
import { Application, HttpError, Router, Status, send,  } from "https://deno.land/x/oak/mod.ts";
// @ts-ignore
import { __ } from 'https://deno.land/x/dirname/mod.ts';
// import "https://deno.land/x/dotenv/load.ts";
const {__dirname } = __(import.meta);
// @ts-ignore
import { IErrorContext, IServerContext } from './@types/server.d.ts'

const HOST_PORT: string = `127.0.0.1:1234`;

const server: Application = new Application()
const router: Router = new Router()

router.get(`*`)
server.use(router.routes())

// Error handler middleware
server.use(async (context , next: () => any) => {
  try {
    await next();
  } catch (e) {
    if (e instanceof HttpError) {
      context.response.status = e.status as any;
      if (e.expose) {
        context.response.body = `<!DOCTYPE html>
            <html>
              <body>
                <h1>${e.status} - ${e.message}</h1>
              </body>
            </html>`;
      } else {
        context.response.body = `<!DOCTYPE html>
            <html>
              <body>
                <h1>${e.status} - ${Status[e.status]}</h1>
              </body>
            </html>`;
      }
    } else if (e instanceof Error) {
      context.response.status = 500;
      context.response.body = `<!DOCTYPE html>
            <html>
              <body>
                <h1>500 - Internal Server Error</h1>
              </body>
            </html>`;
      console.log(e.stack);
    }
  }
});

server
  .use(async (context) => {
    console.log(context, 'CONTEXT')
    await send(context, '',{ 
    root: `${__dirname}`,
    index: "index.html"
})
})

  

console.log(`__SERVER_RUNNING__${HOST_PORT}`)
await server.listen(`${HOST_PORT}`);

