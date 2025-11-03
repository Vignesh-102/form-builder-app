
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/form-builde-app/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/form-builde-app"
  },
  {
    "renderMode": 2,
    "route": "/form-builde-app/formBuilder"
  },
  {
    "renderMode": 2,
    "route": "/form-builde-app/login"
  },
  {
    "renderMode": 2,
    "route": "/form-builde-app/register"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 1152, hash: '068c58821953c52f7f52eeecd3454d195aeef213be6baf81979bd581d463ba5c', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1665, hash: 'b7ff91420cd8d4e8f66de46358edd906803cf41fc5227dc01cbcd9e14a792506', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'formBuilder/index.html': {size: 14406, hash: 'ce963dc077c92af7a2a52c1d7afe490906831e50a0335ea11bb5603576b0aaec', text: () => import('./assets-chunks/formBuilder_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 10258, hash: 'b880e2d35d084ad1ce5f2c92423c42c8e21d457516f88093efe3182f5f3ef18a', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'index.html': {size: 8957, hash: '4577f5d3c26d1a6cb069673b6de4b597068da4efdb00f88286f6bf6ac67cb80c', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 10510, hash: '6aa645c99473e7852b6912cbd700da27a8176b3add684195e09b25a1f23bb98e', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
