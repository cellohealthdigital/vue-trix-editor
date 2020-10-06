import Trix from 'trix';

//
var script = {
  name: 'VueTrixEditor',
  model: {
    prop: 'initial-content',
    event: 'input'
  },
  props: {
    initialContent: {
      type: String,
      default: ''
    },
    uniqueId: {
      type: String,
      default: 'dd-trix-input'
    },
    placeholder: {
      type: String,
      required: false,

      default() {
        return '';
      }

    },
    imageUploads: {
      type: Boolean,
      default: false
    },
    label: String
  },
  data: () => ({
    editor: null,
    focused: false
  }),

  mounted() {
    Trix.config.attachments.preview.caption = {
      name: false,
      size: false
    };

    if (!this.imageUploads) {
      this.hideToolbarAttachBtn();
    }
  },

  methods: {
    hideToolbarAttachBtn() {
      this.$refs.trix.parentElement.querySelector('.trix-button-group--file-tools').style.display = 'none';
    },

    reset() {
      this.editor.loadHTML('');
    },

    init() {
      this.editor = this.$refs.trix.editor;
      this.$refs.trix.editor.insertHTML(this.initialContent);
      this.$refs.trix.addEventListener('trix-change', () => {
        this.$emit('input', this.content());
      });
      this.$emit('initialized');
    },

    content() {
      return document.querySelector(`#${this.uniqueId}`).value;
    },

    checkFile(ev) {
      if (!this.imageUploads) {
        return ev.preventDefault();
      }
    },

    acceptFile(ev) {
      // eslint-disable-next-line no-prototype-builtins
      if (ev.hasOwnProperty('attachment') && ev.attachment.file) {
        this.$emit('trix-attachment-add', ev.attachment);
      }
    },

    removeFile(ev) {
      this.$emit('trix-attachment-remove', ev);
    },

    focus() {
      this.$refs.trix.focus();
    },

    blur() {
      this.$refs.trix.blur();
    }

  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', [_vm.label ? _c('label', {
    class: "trix-label " + (_vm.focused ? 'trix-label--focused' : '')
  }, [_vm._v("\n    " + _vm._s(_vm.label) + "\n  ")]) : _vm._e(), _vm._v(" "), _c('trix-editor', {
    ref: "trix",
    class: _vm.focused && _vm.label ? 'focused' : '',
    attrs: {
      "input": _vm.uniqueId,
      "placeholder": _vm.placeholder
    },
    on: {
      "trix-file-accept": _vm.checkFile,
      "trix-attachment-add": _vm.acceptFile,
      "trix-attachment-remove": _vm.removeFile,
      "trix-initialize": _vm.init,
      "trix-focus": function ($event) {
        _vm.focused = true;
      },
      "trix-blur": function ($event) {
        _vm.focused = false;
      }
    }
  }), _vm._v(" "), _c('input', {
    attrs: {
      "id": _vm.uniqueId,
      "type": "hidden",
      "name": "content"
    }
  })], 1);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-36520e6c_0", {
    source: "@charset \"UTF-8\";.trix-label{font-size:16px;line-height:1;min-height:8px;color:#bbb}.trix-label--focused{color:#000}trix-editor{border:1px solid #bbb;border-radius:3px;margin:0;padding:.4em .6em;min-height:5em;outline:0}trix-editor.focused{border-color:#000}trix-editor [data-trix-mutable]:not(.attachment__caption-editor){-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}trix-editor [data-trix-mutable]::-moz-selection{background:0 0;background:0 0}trix-editor [data-trix-mutable]::selection{background:0 0;background:0 0}trix-editor [data-trix-cursor-target]::-moz-selection{background:0 0}trix-editor [data-trix-cursor-target]::selection{background:0 0}trix-editor [data-trix-mutable].attachment__caption-editor:focus::-moz-selection{background:highlight}trix-editor [data-trix-mutable].attachment__caption-editor:focus::selection{background:highlight}trix-editor [data-trix-mutable].attachment.attachment--file{box-shadow:0 0 0 2px highlight;border-color:transparent}trix-editor [data-trix-mutable].attachment img{box-shadow:0 0 0 2px highlight}trix-editor .attachment{position:relative}trix-editor .attachment:hover{cursor:default}trix-editor .attachment--preview .attachment__caption:hover{cursor:text}trix-editor .attachment__progress{position:absolute;z-index:1;height:20px;top:calc(50% - 10px);left:5%;width:90%;opacity:.9;transition:opacity .2s ease-in}trix-editor .attachment__progress[value=\"100\"]{opacity:0}trix-editor .attachment__caption-editor{display:inline-block;width:100%;margin:0;padding:0;font-size:inherit;font-family:inherit;line-height:inherit;color:inherit;text-align:center;vertical-align:top;border:none;outline:0;-webkit-appearance:none;-moz-appearance:none}trix-editor .attachment__toolbar{position:absolute;z-index:1;top:-.9em;left:0;width:100%;text-align:center}trix-editor .trix-button-group{display:inline-flex}trix-editor .trix-button{position:relative;float:left;color:#666;white-space:nowrap;font-size:80%;padding:0 .8em;margin:0;outline:0;border:none;border-radius:0;background:0 0}trix-editor .trix-button:not(:first-child){border-left:1px solid #ccc}trix-editor .trix-button:not(:disabled){cursor:pointer}trix-editor .trix-button.trix-active{background:#cbeefa}trix-editor .trix-button--remove{text-indent:-9999px;display:inline-block;padding:0;outline:0;width:1.8em;height:1.8em;line-height:1.8em;border-radius:50%;background-color:#fff;border:2px solid highlight;box-shadow:1px 1px 6px rgba(0,0,0,.25)}trix-editor .trix-button--remove::before{display:inline-block;position:absolute;top:0;right:0;bottom:0;left:0;opacity:.7;content:\"\";background-image:url(data:image/svg+xml,%3Csvg%20height%3D%2224%22%20width%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M19%206.4L17.6%205%2012%2010.6%206.4%205%205%206.4l5.6%205.6L5%2017.6%206.4%2019l5.6-5.6%205.6%205.6%201.4-1.4-5.6-5.6z%22%2F%3E%3Cpath%20d%3D%22M0%200h24v24H0z%22%20fill%3D%22none%22%2F%3E%3C%2Fsvg%3E);background-position:center;background-repeat:no-repeat;background-size:90%}trix-editor .trix-button--remove:hover{border-color:#333}trix-editor .trix-button--remove:hover::before{opacity:1}trix-editor .attachment__metadata-container{position:relative}trix-editor .attachment__metadata{position:absolute;left:50%;top:2em;transform:translate(-50%,0);max-width:90%;padding:.1em .6em;font-size:.8em;color:#fff;background-color:rgba(0,0,0,.7);border-radius:3px}trix-editor .attachment__metadata .attachment__name{display:inline-block;max-width:100%;vertical-align:bottom;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}trix-editor .attachment__metadata .attachment__size{margin-left:.2em;white-space:nowrap}trix-toolbar *{box-sizing:border-box}trix-toolbar .trix-button-row{display:flex;flex-wrap:nowrap;justify-content:space-between;overflow-x:auto}trix-toolbar .trix-button-group{display:flex;margin-bottom:10px;border:1px solid #bbb;border-top-color:#ccc;border-bottom-color:#888;border-radius:3px}trix-toolbar .trix-button-group:not(:first-child){margin-left:1.5vw}trix-toolbar .trix-button-group-spacer{flex-grow:1}trix-toolbar .trix-button{position:relative;float:left;color:rgba(0,0,0,.6);font-size:.75em;font-weight:600;white-space:nowrap;padding:0 .5em;margin:0;outline:0;border:none;border-bottom:1px solid #ddd;border-radius:0;background:0 0}trix-toolbar .trix-button:not(:first-child){border-left:1px solid #ccc}trix-toolbar .trix-button:not(:disabled){cursor:pointer}trix-toolbar .trix-button:disabled{color:rgba(0,0,0,.125)}trix-toolbar .trix-button.trix-active{background:rgba(0,0,0,.5);color:#000}trix-toolbar .trix-button--icon{font-size:inherit;width:2.6em;height:1.6em;max-width:calc(.8em + 4vw);text-indent:-9999px}trix-toolbar .trix-button--icon::before{display:inline-block;position:absolute;top:0;right:0;bottom:0;left:0;opacity:.6;content:\"\";background-position:center;background-repeat:no-repeat;background-size:contain}trix-toolbar .trix-button--icon:disabled::before{opacity:.125}trix-toolbar .trix-button--icon.trix-active::before{opacity:1}trix-toolbar .trix-button--icon-bold::before{background-image:url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M15.6%2011.8c1-.7%201.6-1.8%201.6-2.8a4%204%200%200%200-4-4H7v14h7c2.1%200%203.7-1.7%203.7-3.8%200-1.5-.8-2.8-2.1-3.4zM10%207.5h3a1.5%201.5%200%201%201%200%203h-3v-3zm3.5%209H10v-3h3.5a1.5%201.5%200%201%201%200%203z%22%2F%3E%3C%2Fsvg%3E)}trix-toolbar .trix-button--icon-italic::before{background-image:url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M10%205v3h2.2l-3.4%208H6v3h8v-3h-2.2l3.4-8H18V5h-8z%22%2F%3E%3C%2Fsvg%3E)}trix-toolbar .trix-button--icon-link::before{background-image:url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M9.88%2013.7a4.3%204.3%200%200%201%200-6.07l3.37-3.37a4.26%204.26%200%200%201%206.07%200%204.3%204.3%200%200%201%200%206.06l-1.96%201.72a.91.91%200%201%201-1.3-1.3l1.97-1.71a2.46%202.46%200%200%200-3.48-3.48l-3.38%203.37a2.46%202.46%200%200%200%200%203.48.91.91%200%201%201-1.3%201.3z%22%2F%3E%3Cpath%20d%3D%22M4.25%2019.46a4.3%204.3%200%200%201%200-6.07l1.93-1.9a.91.91%200%201%201%201.3%201.3l-1.93%201.9a2.46%202.46%200%200%200%203.48%203.48l3.37-3.38c.96-.96.96-2.52%200-3.48a.91.91%200%201%201%201.3-1.3%204.3%204.3%200%200%201%200%206.07l-3.38%203.38a4.26%204.26%200%200%201-6.07%200z%22%2F%3E%3C%2Fsvg%3E)}trix-toolbar .trix-button--icon-strike::before{background-image:url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M12.73%2014l.28.14c.26.15.45.3.57.44.12.14.18.3.18.5%200%20.3-.15.56-.44.75-.3.2-.76.3-1.39.3A13.52%2013.52%200%200%201%207%2014.95v3.37a10.64%2010.64%200%200%200%204.84.88c1.26%200%202.35-.19%203.28-.56.93-.37%201.64-.9%202.14-1.57s.74-1.45.74-2.32c0-.26-.02-.51-.06-.75h-5.21zm-5.5-4c-.08-.34-.12-.7-.12-1.1%200-1.29.52-2.3%201.58-3.02%201.05-.72%202.5-1.08%204.34-1.08%201.62%200%203.28.34%204.97%201l-1.3%202.93c-1.47-.6-2.73-.9-3.8-.9-.55%200-.96.08-1.2.26-.26.17-.38.38-.38.64%200%20.27.16.52.48.74.17.12.53.3%201.05.53H7.23zM3%2013h18v-2H3v2z%22%2F%3E%3C%2Fsvg%3E)}trix-toolbar .trix-button--icon-quote::before{background-image:url(data:image/svg+xml,%3Csvg%20version%3D%221%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M6%2017h3l2-4V7H5v6h3zm8%200h3l2-4V7h-6v6h3z%22%2F%3E%3C%2Fsvg%3E)}trix-toolbar .trix-button--icon-heading-1::before{background-image:url(data:image/svg+xml,%3Csvg%20version%3D%221%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M12%209v3H9v7H6v-7H3V9h9zM8%204h14v3h-6v12h-3V7H8V4z%22%2F%3E%3C%2Fsvg%3E)}trix-toolbar .trix-button--icon-code::before{background-image:url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M18.2%2012L15%2015.2l1.4%201.4L21%2012l-4.6-4.6L15%208.8l3.2%203.2zM5.8%2012L9%208.8%207.6%207.4%203%2012l4.6%204.6L9%2015.2%205.8%2012z%22%2F%3E%3C%2Fsvg%3E)}trix-toolbar .trix-button--icon-bullet-list::before{background-image:url(data:image/svg+xml,%3Csvg%20version%3D%221%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M4%204a2%202%200%201%200%200%204%202%202%200%200%200%200-4zm0%206a2%202%200%201%200%200%204%202%202%200%200%200%200-4zm0%206a2%202%200%201%200%200%204%202%202%200%200%200%200-4zm4%203h14v-2H8v2zm0-6h14v-2H8v2zm0-8v2h14V5H8z%22%2F%3E%3C%2Fsvg%3E)}trix-toolbar .trix-button--icon-number-list::before{background-image:url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M2%2017h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1%203h1.8L2%2013.1v.9h3v-1H3.2L5%2010.9V10H2v1zm5-6v2h14V5H7zm0%2014h14v-2H7v2zm0-6h14v-2H7v2z%22%2F%3E%3C%2Fsvg%3E)}trix-toolbar .trix-button--icon-undo::before{background-image:url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M12.5%208c-2.6%200-5%201-6.9%202.6L2%207v9h9l-3.6-3.6A8%208%200%200%201%2020%2016l2.4-.8a10.5%2010.5%200%200%200-10-7.2z%22%2F%3E%3C%2Fsvg%3E)}trix-toolbar .trix-button--icon-redo::before{background-image:url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M18.4%2010.6a10.5%2010.5%200%200%200-16.9%204.6L4%2016a8%208%200%200%201%2012.7-3.6L13%2016h9V7l-3.6%203.6z%22%2F%3E%3C%2Fsvg%3E)}trix-toolbar .trix-button--icon-decrease-nesting-level::before{background-image:url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M3%2019h19v-2H3v2zm7-6h12v-2H10v2zm-8.3-.3l2.8%202.9L6%2014.2%204%2012l2-2-1.4-1.5L1%2012l.7.7zM3%205v2h19V5H3z%22%2F%3E%3C%2Fsvg%3E)}trix-toolbar .trix-button--icon-increase-nesting-level::before{background-image:url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M3%2019h19v-2H3v2zm7-6h12v-2H10v2zm-6.9-1L1%2014.2l1.4%201.4L6%2012l-.7-.7-2.8-2.8L1%209.9%203.1%2012zM3%205v2h19V5H3z%22%2F%3E%3C%2Fsvg%3E)}trix-toolbar .trix-button--icon-attach::before{background-image:url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M16.5%206v11.5a4%204%200%201%201-8%200V5a2.5%202.5%200%200%201%205%200v10.5a1%201%200%201%201-2%200V6H10v9.5a2.5%202.5%200%200%200%205%200V5a4%204%200%201%200-8%200v12.5a5.5%205.5%200%200%200%2011%200V6h-1.5z%22%2F%3E%3C%2Fsvg%3E)}trix-toolbar .trix-dialogs{position:relative}trix-toolbar .trix-dialog{position:absolute;top:0;left:0;right:0;font-size:.75em;padding:15px 10px;background:#fff;box-shadow:0 .3em 1em #ccc;border-top:2px solid #888;border-radius:5px;z-index:5}trix-toolbar .trix-input--dialog{font-size:inherit;font-weight:400;padding:.5em .8em;margin:0 10px 0 0;border-radius:3px;border:1px solid #bbb;background-color:#fff;box-shadow:none;outline:0;-webkit-appearance:none;-moz-appearance:none}trix-toolbar .trix-input--dialog.validate:invalid{box-shadow:red 0 0 1.5px 1px}trix-toolbar .trix-button--dialog{font-size:inherit;padding:.5em;border-bottom:none}trix-toolbar .trix-dialog--link{max-width:600px}trix-toolbar .trix-dialog__link-fields{display:flex;align-items:baseline}trix-toolbar .trix-dialog__link-fields .trix-input{flex:1}trix-toolbar .trix-dialog__link-fields .trix-button-group{flex:0 0 content;margin:0}.trix-content{white-space:pre-wrap;line-height:1.5}.trix-content *{box-sizing:border-box}.trix-content h1{font-size:1.2em;line-height:1.2;margin:0}.trix-content blockquote{margin:0 0 0 .3em;padding:0 0 0 .6em;border-left:.3em solid #ccc}.trix-content pre{display:inline-block;width:100%;vertical-align:top;font-family:monospace;font-size:.9em;margin:0;padding:.5em;white-space:pre;background-color:#eee;overflow-x:auto}.trix-content ul{margin:0;padding:0}.trix-content ul li{margin-left:1em}.trix-content ol{margin:0;padding:0}.trix-content ol li{margin-left:1em}.trix-content li{margin:0;padding:0}.trix-content li li{margin-left:1em}.trix-content img{max-width:100%;height:auto}.trix-content .attachment{display:inline-block;position:relative;max-width:100%;margin:0;padding:0}.trix-content .attachment a{color:inherit;text-decoration:none}.trix-content .attachment a:hover{color:inherit}.trix-content .attachment a:visited:hover{color:inherit}.trix-content .attachment__caption{padding:0;text-align:center}.trix-content .attachment__caption .attachment__name+.attachment__size::before{content:\" · \"}.trix-content .attachment--preview{width:100%;text-align:center}.trix-content .attachment--preview .attachment__caption{color:#666;font-size:.9em;line-height:1.2}.trix-content .attachment--file{color:#333;line-height:1;margin:0 2px 2px 0;padding:.4em 1em;border:1px solid #bbb;border-radius:5px}.trix-content .attachment-gallery{display:flex;flex-wrap:wrap;position:relative;margin:0;padding:0}.trix-content .attachment-gallery .attachment{flex:1 0 33%;padding:0 .5em;max-width:33%}.trix-content .attachment-gallery.attachment-gallery--2 .attachment{flex-basis:50%;max-width:50%}.trix-content .attachment-gallery.attachment-gallery--4 .attachment{flex-basis:50%;max-width:50%}@media (max-device-width:768px){trix-toolbar .trix-button-group:not(:first-child){margin-left:0}trix-toolbar .trix-button-group-spacer{display:none}trix-toolbar .trix-button{letter-spacing:-.01em;padding:0 .3em}trix-toolbar .trix-button--icon{height:2em;max-width:calc(.8em + 3.5vw)}trix-toolbar .trix-button--icon::before{right:6%;left:6%}}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__ = undefined;
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);

// Import vue component

const install = function installVueTrixEditor(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('VueTrixEditor', __vue_component__);
}; // Create module definition for Vue.use()
// to be registered via Vue.use() as well as Vue.component()


__vue_component__.install = install; // Export component by default

export default __vue_component__;
