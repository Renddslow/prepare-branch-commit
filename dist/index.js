/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 620:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/* module decorator */ module = __nccwpck_require__.nmd(module);
define(["require", "exports", "@actions/core", "./index.js"], function (require, exports, core_1, index_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const runAction = () => {
        try {
            const branchName = core_1.default.getInput('branch-name');
            const issueTags = (0, index_js_1.extractTicketLabels)(branchName);
            if (!issueTags) {
                console.log('Did not find any issue tags.');
                return;
            }
            const tagsCSV = issueTags.join(',');
            core_1.default.setOutput('issue-tags', tagsCSV);
        }
        catch (error) {
            core_1.default.setFailed(error.message);
        }
    };
    if (require.main === module) {
        runAction();
    }
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__nccwpck_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(620);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;