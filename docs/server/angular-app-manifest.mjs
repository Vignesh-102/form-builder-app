
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/form-builder-app/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/form-builder-app"
  },
  {
    "renderMode": 2,
    "route": "/form-builder-app/formBuilder"
  },
  {
    "renderMode": 2,
    "route": "/form-builder-app/login"
  },
  {
    "renderMode": 2,
    "route": "/form-builder-app/register"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 1153, hash: '4c3fe40c3dec688651bfeacf140cc48017b1fb94844b9397aff2eade90785446', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1666, hash: '9bb3423393a238eff2eb5b6e9fadffb1a2598bf1fdc550bf6abc6d8561be283c', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 7373, hash: 'b855f3827dc34d20ced584c747a7ce87d720757d5f25b81a126135bd55682b83', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 10511, hash: '4b7b7ce60e11f990d47a11ca43dd5bd950f1d62d509eca541754dcbfe06c486b', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 10260, hash: '95269d03a03ed640cea813ed995d9ad71a0bb53feaf0e7bb53948075bdbde963', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'formBuilder/index.html': {size: 14754, hash: 'a6d72a23a6c6d912fb5413e11858b8c6f31ebf1bf7dd807bb557be6f12aea38f', text: () => import('./assets-chunks/formBuilder_index_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
