/*
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 * More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
 * More on args: https://storybook.js.org/docs/react/writing-stories/args
 * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
 */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { GitHubExporterSettings } from '../components/GitHubProjectExporterSettings';

export default {
  title: 'Tools/GitHub Project Exporter',
  component: GitHubExporterSettings,
  parameters: {
    controls: {
      disable: true,
    },
  },
} as ComponentMeta<typeof GitHubExporterSettings>;

const Template: ComponentStory<typeof GitHubExporterSettings> = (args) => <GitHubExporterSettings {...args} />;

export const Settings = Template.bind({});
