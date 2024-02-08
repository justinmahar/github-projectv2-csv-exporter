import type { Meta, StoryObj } from '@storybook/react';
import { GitHubProjectExporter } from '../components/GitHubProjectExporter';

// === Setup ===
const StoryComponent = GitHubProjectExporter; // <-- Set to your component
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
export const Exporter: Story = {
  args: {},
};
