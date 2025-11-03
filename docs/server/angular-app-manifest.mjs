
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
    'index.csr.html': {size: 1153, hash: '547d8ad194f29ab695f513f5486193c23de0bc226002ec9fc1e1e187c6958f8b', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1666, hash: '3224fe972fa7e876311cf8e603e18127f323b311b6831008115cd800e4249328', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'login/index.html': {size: 10260, hash: '2defeb96c1eb6c5eef230549405449e60035cc01a836c79cf0f0358226f4b22e', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'formBuilder/index.html': {size: 14407, hash: '7636de0f878a2e2f4fedbe044188c5de8a50d1e51e8c30f13c45c8884ffd9fd0', text: () => import('./assets-chunks/formBuilder_index_html.mjs').then(m => m.default)},
    'index.html': {size: 8958, hash: 'd72bf318f639204d4876284cd30a4ab988712c8b9f29c20e6d73718d44a1f970', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 10511, hash: 'ded34d45f756658eada978ff5eefbce8e611eb9332f9c8fb4e9438e9db2a05f9', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
