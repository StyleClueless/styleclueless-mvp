import Koa from 'koa'
import * as React from 'react'
import dotenv from 'dotenv'
import KoaReactRouter from 'koa-react-router'
import KoaStatic from 'koa-static'
import KoaRouter from 'koa-router'
import KoaMount from 'koa-mount'
import { App } from './client/app.js'

import Container from './client/containers/Container';
import { connect } from './server/mongo-connection'
import { getItemsByQuery } from './server/items'
import { getOutfitsBySKU } from './server/outfits'

dotenv.config()

// babelRegister({
//   presets: ['react']
// })

const app = new Koa()
const koaRouter = new KoaRouter()
const assetsServer = KoaStatic('public')
const distServer = KoaStatic('dist')

app.use(KoaMount('/public', assetsServer))
app.use(KoaMount('/dist', distServer))

koaRouter.get('/items', async ctx => {
  ctx.body = await getItemsByQuery(ctx.query)
})

koaRouter.get('/items/:itemCode/outfits', async ctx => {
  ctx.body = await getOutfitsBySKU(ctx.params.itemCode)
})

app.use(KoaMount('/api', koaRouter.routes()))

const clientEnvVars = {
  CLOUDINARY_BASE_URL: process.env.CLOUDINARY_BASE_URL
}
app.use(KoaReactRouter({
  App,
  onError: (ctx, err) => console.log('I Have failed!!!!', err),
  onRedirect: (ctx, redirect) => console.log('I have redirected!'),
  onRender: (ctx) => {
    console.log('Rendering ', ctx.url)

    return {
      containerRenderer: (view) => (
        <Container>
          <script dangerouslySetInnerHTML={{ __html: `window.envVars = ${JSON.stringify(clientEnvVars)}` }} />
          <div dangerouslySetInnerHTML={{ __html: view }} />
        </Container>
      )
    }
  }
}))

;(async function () {
  try {
    await connect()
    const port = process.env.PORT || 3000
    app.listen(port)
    console.log(`Listening on ${port}`)
  } catch (e) {
    console.error('Server init failed', e)
  }
})()