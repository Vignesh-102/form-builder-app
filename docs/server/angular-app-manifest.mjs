
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
    'index.csr.html': {size: 1153, hash: 'd7f891e3af359d3ec3fa49c60ebfb4059d7b0ee93bf5a44f325b6accf92171b1', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1666, hash: '65f06cab022e51c12ae79c25eebe84f4ded6ba4eac8728509795e9e0e52b5b55', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 7373, hash: 'f48968659c11b45089cf8cc98704389e662ee604d6171225dc0ebf4b4c213d10', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 10511, hash: 'e95f873a2e86f7de490f9f3e0006df4374d31391bf55bbef4d80291ddc088adf', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 10260, hash: '8a88bf2cdcffa79bb195de569707b12f06d9d2e2039c14c526f6ad32c3aef1b1', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'formBuilder/index.html': {size: 14478, hash: 'df2d057c44136c8136b3d6f501af008a32f307c45e6263e99ba126b125a84f27', text: () => import('./assets-chunks/formBuilder_index_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
