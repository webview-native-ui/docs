// Keep the temporary launch hostname working without adding code to the canonical static site.
export const LEGACY_DOCS_HOST = 'webview-native-ui.rdlabo.dev';
export const CANONICAL_DOCS_ORIGIN = 'https://webview-native-ui.com';

export default {
  fetch(request) {
    const source = new URL(request.url);
    const destination = new URL(CANONICAL_DOCS_ORIGIN);
    destination.pathname = source.pathname;
    destination.search = source.search;
    return Response.redirect(destination, 301);
  },
};
