import type { Meta, StoryObj } from '@storybook/react';
import { GitHubExporterSettings } from '../components/GitHubProjectExporterSettings';

// === Setup ===
const StoryComponent = GitHubExporterSettings; // <-- Set to your component
const meta: Meta<typeof StoryComponent> = {
  title: 'Tools/GitHub Project Exporter', // <-- Set to your story title
  component: StoryComponent,
  parameters: {
    options: { showPanel: false }, // Don't show addons panel
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

// === Stories ===
export const Settings: Story = {
  args: {},
};
