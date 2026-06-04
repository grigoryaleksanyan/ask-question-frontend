import type { App } from 'vue';

import { SlideOver } from '@/shared/ui/slide-over';

export default function registerGlobalComponents(app: App) {
  app.component('SlideOver', SlideOver);
}
