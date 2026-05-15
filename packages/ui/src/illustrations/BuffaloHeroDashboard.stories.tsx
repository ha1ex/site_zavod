import type { Meta, StoryObj } from '@storybook/react';
import BuffaloHeroDashboard from './BuffaloHeroDashboard.js';

const meta: Meta<typeof BuffaloHeroDashboard> = {
  title: 'Illustrations/BuffaloHeroDashboard',
  component: BuffaloHeroDashboard,
  parameters: { layout: 'fullscreen' },
};

export default meta;

export const Light: StoryObj<typeof BuffaloHeroDashboard> = {
  render: () => (
    <div className="bg-white p-8">
      <BuffaloHeroDashboard className="w-full max-w-5xl mx-auto" />
    </div>
  ),
};

export const Dark: StoryObj<typeof BuffaloHeroDashboard> = {
  render: () => (
    <div className="dark bg-slate-950 p-8">
      <BuffaloHeroDashboard className="w-full max-w-5xl mx-auto" />
    </div>
  ),
};
