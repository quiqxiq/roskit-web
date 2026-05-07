// Compose voucher preview HTML untuk iframe sandbox.
//
// Template asli (dari @/web/template/) bergantung pada:
//   - jQuery (load <script src="assets/js/jquery.min.js">) — script tag tsb akan
//     gagal load di iframe sandbox (asset path tidak ada). Kita strip/replace.
//   - global `currency` variable
//   - global `currencyFormat(n, c)` function
//
// Kita inject pre-script: jQuery shim minimal + currency + currencyFormat,
// supaya `<script>` block di template asli tidak crash dan visualisasi tetap
// dekat ke output produksi.

import { type PreviewVarianceMode } from '../data/schema'

const JQUERY_CDN_LINE_REGEX =
  /<script[^>]+src=["']assets\/js\/jquery\.min\.js["'][^>]*><\/script>/gi

const PRE_SCRIPT = `<script>
// === Roskit preview shim (jQuery-lite + currency helpers) ===
(function () {
  function NodeList(els) { this.els = els || []; this.length = this.els.length; }
  NodeList.prototype.show = function () {
    this.els.forEach(function (el) { el.style.display = ''; });
    return this;
  };
  NodeList.prototype.hide = function () {
    this.els.forEach(function (el) { el.style.display = 'none'; });
    return this;
  };
  NodeList.prototype.html = function (v) {
    if (v === undefined) return this.els[0] ? this.els[0].innerHTML : '';
    this.els.forEach(function (el) { el.innerHTML = v; });
    return this;
  };
  NodeList.prototype.css = function (prop, val) {
    this.els.forEach(function (el) { el.style[prop] = val; });
    return this;
  };
  NodeList.prototype.length = 0;
  function $(selOrFn) {
    if (typeof selOrFn === 'function') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', selOrFn);
      } else {
        selOrFn();
      }
      return;
    }
    var arr = [].slice.call(document.querySelectorAll(selOrFn));
    var nl = new NodeList(arr);
    // truthy seperti jQuery: $(...) ber-evaluate truthy walaupun length=0,
    // template asli pakai pattern \`if($('.validity'))\` jadi kita biarkan.
    return nl;
  }
  window.$ = $;
  window.jQuery = $;
  if (typeof window.currency === 'undefined') window.currency = 'Rp';
  if (typeof window.currencyFormat === 'undefined') {
    window.currencyFormat = function (n, c) {
      try {
        return (c || '') + ' ' + Number(n).toLocaleString('en-US');
      } catch (e) { return String(n); }
    };
  }
})();
</script>`

function injectShim(headerHtml: string): string {
  // Hapus script tag jQuery asli — kita pakai shim sendiri
  let html = headerHtml.replace(JQUERY_CDN_LINE_REGEX, '')
  // Inject shim sebelum </head>; fallback append jika tidak ada </head>
  if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `${PRE_SCRIPT}\n</head>`)
  } else {
    html = `${PRE_SCRIPT}\n${html}`
  }
  return html
}

function substitute(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/%([a-zA-Z0-9#_]+)%/g, (_, key: string) => {
    const val = vars[key]
    return val === undefined ? '' : val
  })
}

export type ComposeOptions = {
  header: string
  row: string
  footer: string
  rowCount: number
  baseVars: Record<string, string>
  varianceMode: PreviewVarianceMode
}

export function composePreview(opts: ComposeOptions): string {
  const head = injectShim(opts.header)

  const rows: string[] = []
  for (let i = 0; i < opts.rowCount; i++) {
    const idx = i + 1
    const vars: Record<string, string> = {
      ...opts.baseVars,
      '#': String(idx),
    }
    if (opts.varianceMode === 'vc') {
      // voucher code: username == password
      vars.password = vars.username
    }
    rows.push(substitute(opts.row, vars))
  }

  return head + '\n' + rows.join('\n') + '\n' + opts.footer
}
