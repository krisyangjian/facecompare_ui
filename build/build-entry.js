const Components = require('../components.json');
const fs = require('fs');
const render = require('json-templater/string');
const uppercamelcase = require('uppercamelcase');
const path = require('path');
const endOfLine = require('os').EOL;

const OUTPUT_PATH = path.join(__dirname, '../src/index.js');
const IMPORT_TEMPLATE = 'import {{name}} from \'./components/packages/{{package}}/index.js\';';
const INSTALL_COMPONENT_TEMPLATE = '  {{name}}';
const MAIN_TEMPLATE = `/* Automatically generated by './build/bin/build-entry.js' */

{{include}}
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import locale from './locale/lang/zh-CN';
Vue.use(VueI18n);
Vue.locale('zh-CN', locale);


const components = [
{{install}}
];

const install = function(Vue, opts = {}) {
  /* istanbul ignore if */
  if (install.installed) return;

  components.map(component => {
    Vue.component(component.name, component);
  });
};

module.exports = {
  install,
{{list}}
};

module.exports.default = module.exports;
`;

delete Components.font;

const ComponentNames = Object.keys(Components);

const includeComponentTemplate = [];
const installTemplate = [];
const listTemplate = [];

ComponentNames.forEach((name) => {
  const componentName = uppercamelcase(name);

  includeComponentTemplate.push(render(IMPORT_TEMPLATE, {
    name: componentName,
    package: name
  }));

  if (['Loading', 'MessageBox', 'Notification', 'Message'].indexOf(componentName) === -1) {
    installTemplate.push(render(INSTALL_COMPONENT_TEMPLATE, {
      name: componentName,
      component: name
    }));
  }

  if (componentName !== 'Loading') listTemplate.push(`  ${componentName}`);
});

const template = render(MAIN_TEMPLATE, {
  include: includeComponentTemplate.join(endOfLine),
  install: installTemplate.join(`,${endOfLine}`),
  // version: process.env.VERSION || require('../package.json').version,
  list: listTemplate.join(`,${endOfLine}`)
});

fs.writeFileSync(OUTPUT_PATH, template);
console.log('[build entry] DONE:', OUTPUT_PATH);

