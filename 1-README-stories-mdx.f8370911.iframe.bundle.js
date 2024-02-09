/*! For license information please see 1-README-stories-mdx.f8370911.iframe.bundle.js.LICENSE.txt */
(self.webpackChunkgithub_projectv2_csv_exporter=self.webpackChunkgithub_projectv2_csv_exporter||[]).push([[836],{"./node_modules/@mdx-js/react/lib/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Ck:()=>withMDXComponents,Eh:()=>MDXContext,Iu:()=>MDXProvider,MN:()=>useMDXComponents});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");const MDXContext=react__WEBPACK_IMPORTED_MODULE_0__.createContext({});function withMDXComponents(Component){return function boundMDXComponent(props){const allComponents=useMDXComponents(props.components);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Component,{...props,allComponents})}}function useMDXComponents(components){const contextComponents=react__WEBPACK_IMPORTED_MODULE_0__.useContext(MDXContext);return react__WEBPACK_IMPORTED_MODULE_0__.useMemo((()=>"function"==typeof components?components(contextComponents):{...contextComponents,...components}),[contextComponents,components])}const emptyObject={};function MDXProvider({components,children,disableParentContext}){let allComponents;return allComponents=disableParentContext?"function"==typeof components?components({}):components||emptyObject:useMDXComponents(components),react__WEBPACK_IMPORTED_MODULE_0__.createElement(MDXContext.Provider,{value:allComponents},children)}},"./node_modules/@storybook/addon-docs/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Qb:()=>_storybook_blocks__WEBPACK_IMPORTED_MODULE_1__.Qb});__webpack_require__("./node_modules/@storybook/addon-docs/dist/chunk-HLWAVYOI.mjs");var _storybook_blocks__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@storybook/blocks/dist/index.mjs")},"./src/stories/core/1.README.stories.mdx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{__namedExportsOrder:()=>__namedExportsOrder,__page:()=>__page,default:()=>_1_README_stories});__webpack_require__("./node_modules/react/index.js");var lib=__webpack_require__("./node_modules/@mdx-js/react/lib/index.js"),dist=__webpack_require__("./node_modules/@storybook/addon-docs/dist/index.mjs"),blocks_dist=__webpack_require__("./node_modules/@storybook/blocks/dist/index.mjs");const READMEraw_namespaceObject='<h2 align="center">\n  📂 GitHub Project CSV Exporter (ProjectV2)\n</h2>\n<h3 align="center">\n  Export GitHub project cards as CSV files. Uses the ProjectV2 API.\n</h3>\n<p align="center">\n  <a href="https://badge.fury.io/js/github-projectv2-csv-exporter" target="_blank" rel="noopener noreferrer"><img src="https://badge.fury.io/js/github-projectv2-csv-exporter.svg" alt="npm Version" /></a>&nbsp;\n  <a href="https://github.com/justinmahar/github-projectv2-csv-exporter/" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/GitHub-Source-success" alt="View project on GitHub" /></a>&nbsp;\n  <a href="https://github.com/justinmahar/github-projectv2-csv-exporter/actions?query=workflow%3ADeploy" target="_blank" rel="noopener noreferrer"><img src="https://github.com/justinmahar/github-projectv2-csv-exporter/workflows/Deploy/badge.svg" alt="Deploy Status" /></a>\n</p>\n\x3c!-- [lock:donate-badges] 🚫--------------------------------------- --\x3e\r\n<p align="center">\r\n  <a href="https://ko-fi.com/justinmahar"><img src="https://img.shields.io/static/v1?label=Buy%20me%20a%20coffee&message=%E2%9D%A4&logo=KoFi&color=%23fe8e86" alt="Buy me a coffee" /></a>&nbsp;<a href="https://github.com/sponsors/justinmahar" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86" alt="Sponsor"/></a>\r\n</p>\r\n\x3c!-- [/lock:donate-badges] ---------------------------------------🚫 --\x3e\r\n\n## **[→ Open The GitHub Project Exporter ←](https://justinmahar.github.io/github-projectv2-csv-exporter/?path=/story/tools-github-project-exporter--exporter)**\n\n## Documentation\n\nRead the **[official documentation](https://justinmahar.github.io/github-projectv2-csv-exporter/)**.\n\n## Overview\n\nThis export tool allows you to export GitHub projects as a CSV. \n\nProjects must exist within the [ProjectV2 API](https://github.blog/changelog/2022-06-23-the-new-github-issues-june-23rd-update/). For exporting "classic" GitHub projects (older implementation), you can try using [this exporter by Stephen Wu](https://github.com/wustep/github-project-exporter).\n\n### Features include:\n\n- **⬇️ Export all GitHub project cards as a CSV.**\n  - View your GitHub cards in your spreadsheet software of choice.\n- **🎛️ Filter issues by status, customize fields, and exclude closed issues.**\n  - Only export cards with the statuses you specify, with options to choose custom fields, or hide closed issues.\n- **🚀 Easy to use**\n  - Features a simple and easy to use web UI. Configure once. Click once to export.\n\n\x3c!-- [lock:donate] 🚫--------------------------------------- --\x3e\r\n\r\n## Donate \r\n\r\nIf this project helped you, please consider buying me a coffee or sponsoring me. Your support is much appreciated!\r\n\r\n<a href="https://ko-fi.com/justinmahar"><img src="https://img.shields.io/static/v1?label=Buy%20me%20a%20coffee&message=%E2%9D%A4&logo=KoFi&color=%23fe8e86" alt="Buy me a coffee" /></a>&nbsp;<a href="https://github.com/sponsors/justinmahar" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86" alt="Sponsor"/></a>\r\n\r\n\x3c!-- [/lock:donate] ---------------------------------------🚫 --\x3e\r\n\n## Table of Contents\n\n- [**→ Open The GitHub Project Exporter ←**](#-open-the-github-project-exporter-)\n- [Documentation](#documentation)\n- [Overview](#overview)\n  - [Features include:](#features-include)\n- [Donate](#donate)\n- [Table of Contents](#table-of-contents)\n- [Installation](#installation)\n- [Usage](#usage)\n  - [Via Website](#via-website)\n  - [Via Local Storybook Site](#via-local-storybook-site)\n      - [Clone the project](#clone-the-project)\n      - [Install dependencies](#install-dependencies)\n      - [Start the project](#start-the-project)\n      - [Open localhost:6006](#open-localhost6006)\n  - [Via `npm`](#via-npm)\n    - [fetchProjects](#fetchprojects)\n      - [Example](#example)\n    - [fetchProjectItems](#fetchprojectitems)\n      - [Example](#example-1)\n- [TypeScript](#typescript)\n- [Icon Attribution](#icon-attribution)\n- [Contributing](#contributing)\n- [⭐ Found It Helpful? Star It!](#-found-it-helpful-star-it)\n- [License](#license)\n\n## Installation\n\n```\nnpm i github-projectv2-csv-exporter\n```\n\n## Usage\n\n### Via Website\n\nGo here: **[GitHub Project Exporter](https://justinmahar.github.io/github-projectv2-csv-exporter/?path=/story/tools-github-project-exporter--exporter)**.\n\nThis is a static Storybook site hosted on GitHub Pages.\n\n### Via Local Storybook Site\n\nIf you\'d like, you can run the project locally.\n\n##### Clone the project\n\n```bash\ngit clone git@github.com:justinmahar/github-projectv2-csv-exporter.git\n```\n\nAnd navigate to the project:\n\n```bash\ncd github-projectv2-csv-exporter\n```\n\n##### Install dependencies\n\n```bash\nnpm install\n```\n\n##### Start the project\n\n```\nnpm start\n```\n##### Open localhost:6006\n\nOnce the Storybook server starts, a development server will be running locally. \n\nOpen the project here: [localhost:6006](http://localhost:6006/)\n\n### Via `npm`\n\nIf you want to fetch the data yourself, you can install this package via npm and use the exported fetch functions.\n\n> Note: Your access token must include the following scopes: `repo`, `read:org`, `read:user`, `read:project`\n\n#### fetchProjects\n\n```ts\nfetchProjects = async (login: string, isOrg: boolean, token: string): Promise<Projects>\n```\n\nProvide an org or username and the token. The promise will be resolved with a `Projects` instance.\n\n##### Example\n\n```ts\nimport { fetchProjects } from \'github-projectv2-csv-exporter\';\n// ...\nfetchProjects(\'my-org\', true, \'abc123mytoken\').then((orgProjects) =>\n  console.log(\n    \'Loaded projects:\',\n    orgProjects\n      .getProjects()\n      .map((p) => `${p.getTitle()} (number ${p.getProjectNumber()} | ${p.getTotalItemCount()} items)`)\n      .join(\', \'),\n  ),\n);\n```\n\n#### fetchProjectItems\n\n```ts\nfetchProjectItems = async (login: string, isOrg: boolean, projectNumber: number, token: string, progress?: (loaded: number, total: number) => void): Promise<ProjectItem[]>\n```\n\nProvide an org or username, project number, and token. Optionally, you can provide a `progress` function that will be called periodically with the number of items loaded, and the total expected.\n\nThe promise will be resolved with an array of `ProjectItem` instances.\n\n##### Example\n\n```ts\nimport { fetchProjectItems } from \'github-projectv2-csv-exporter\';\n// ...\nconst projectNumber = loadedProject.getProjectNumber();\nfetchProjectItems(\'my-org\', true, projectNumber, \'abc123mytoken\', (loaded, total) =>\n  console.log(`Progress: ${Math.round((loaded / total) * 100)}%`),\n).then((items) => console.log(\'Loaded\', items.length, \'items\'));\n```\n\n\x3c!-- [lock:typescript] 🚫--------------------------------------- --\x3e\r\n\r\n## TypeScript\r\n\r\nType definitions have been included for [TypeScript](https://www.typescriptlang.org/) support.\r\n\r\n\x3c!-- [/lock:typescript] ---------------------------------------🚫 --\x3e\r\n\n\x3c!-- [lock:icon] 🚫--------------------------------------- --\x3e\r\n\r\n## Icon Attribution\r\n\r\nFavicon by [Twemoji](https://github.com/twitter/twemoji).\r\n\r\n\x3c!-- [/lock:icon] ---------------------------------------🚫 --\x3e\r\n\n\x3c!-- [lock:contributing] 🚫--------------------------------------- --\x3e\r\n\r\n## Contributing\r\n\r\nOpen source software is awesome and so are you. 😎\r\n\r\nFeel free to submit a pull request for bugs or additions, and make sure to update tests as appropriate. If you find a mistake in the docs, send a PR! Even the smallest changes help.\r\n\r\nFor major changes, open an issue first to discuss what you\'d like to change.\r\n\r\n\x3c!-- [/lock:contributing] --------------------------------------🚫 --\x3e\n\n## ⭐ Found It Helpful? [Star It!](https://github.com/justinmahar/github-projectv2-csv-exporter/stargazers)\n\nIf you found this project helpful, let the community know by giving it a [star](https://github.com/justinmahar/github-projectv2-csv-exporter/stargazers): [👉⭐](https://github.com/justinmahar/github-projectv2-csv-exporter/stargazers)\n\n## License\n\nSee [LICENSE.md](https://justinmahar.github.io/github-projectv2-csv-exporter/?path=/docs/license--docs).';var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");function _createMdxContent(props){return(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)(dist.Qb,{title:"Home"}),"\n",(0,jsx_runtime.jsx)(blocks_dist.Ih,{children:READMEraw_namespaceObject})]})}const __page=()=>{throw new Error("Docs-only story")};__page.parameters={docsOnly:!0};const componentMeta={title:"Home",tags:["stories-mdx"],includeStories:["__page"]};componentMeta.parameters=componentMeta.parameters||{},componentMeta.parameters.docs={...componentMeta.parameters.docs||{},page:function MDXContent(props={}){const{wrapper:MDXLayout}=Object.assign({},(0,lib.MN)(),props.components);return MDXLayout?(0,jsx_runtime.jsx)(MDXLayout,{...props,children:(0,jsx_runtime.jsx)(_createMdxContent,{...props})}):_createMdxContent()}};const _1_README_stories=componentMeta,__namedExportsOrder=["__page"]},"./node_modules/memoizerific sync recursive":module=>{function webpackEmptyContext(req){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}webpackEmptyContext.keys=()=>[],webpackEmptyContext.resolve=webpackEmptyContext,webpackEmptyContext.id="./node_modules/memoizerific sync recursive",module.exports=webpackEmptyContext},"./node_modules/react/cjs/react-jsx-runtime.production.min.js":(__unused_webpack_module,exports,__webpack_require__)=>{"use strict";var f=__webpack_require__("./node_modules/react/index.js"),k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};function q(c,a,g){var b,d={},e=null,h=null;for(b in void 0!==g&&(e=""+g),void 0!==a.key&&(e=""+a.key),void 0!==a.ref&&(h=a.ref),a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps)void 0===d[b]&&(d[b]=a[b]);return{$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}exports.Fragment=l,exports.jsx=q,exports.jsxs=q},"./node_modules/react/jsx-runtime.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";module.exports=__webpack_require__("./node_modules/react/cjs/react-jsx-runtime.production.min.js")}}]);