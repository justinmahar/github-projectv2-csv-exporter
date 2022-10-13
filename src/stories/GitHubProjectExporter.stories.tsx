/*
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 * More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
 * More on args: https://storybook.js.org/docs/react/writing-stories/args
 * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
 */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { GitHubProjectExporter } from '../components/GitHubProjectExporter';

export default {
  title: 'Tools/GitHub Project Exporter',
  component: GitHubProjectExporter,
  parameters: {
    controls: {
      disable: true,
    },
  },
} as ComponentMeta<typeof GitHubProjectExporter>;

const Template: ComponentStory<typeof GitHubProjectExporter> = (args) => <GitHubProjectExporter {...args} />;

export const Exporter = Template.bind({});
GitHubProjectExporter.args = {};
