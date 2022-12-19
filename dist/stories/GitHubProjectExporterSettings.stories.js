"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
/*
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 * More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
 * More on args: https://storybook.js.org/docs/react/writing-stories/args
 * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
 */
const react_1 = __importDefault(require("react"));
const GitHubProjectExporterSettings_1 = require("../components/GitHubProjectExporterSettings");
exports.default = {
    title: 'Tools/GitHub Project Exporter',
    component: GitHubProjectExporterSettings_1.GitHubExporterSettings,
    parameters: {
        controls: {
            disable: true,
        },
    },
};
const Template = (args) => react_1.default.createElement(GitHubProjectExporterSettings_1.GitHubExporterSettings, Object.assign({}, args));
exports.Settings = Template.bind({});
