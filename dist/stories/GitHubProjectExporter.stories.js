"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exporter = void 0;
/*
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 * More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
 * More on args: https://storybook.js.org/docs/react/writing-stories/args
 * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
 */
const react_1 = __importDefault(require("react"));
const GitHubProjectExporter_1 = require("../components/GitHubProjectExporter");
exports.default = {
    title: 'Tools/GitHub Project Exporter',
    component: GitHubProjectExporter_1.GitHubProjectExporter,
    parameters: {
        controls: {
            disabled: true,
        },
        options: { showPanel: false },
    },
};
const Template = (args) => react_1.default.createElement(GitHubProjectExporter_1.GitHubProjectExporter, Object.assign({}, args));
exports.Exporter = Template.bind({});
