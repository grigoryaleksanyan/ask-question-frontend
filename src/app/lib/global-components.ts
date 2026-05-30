import type { App } from 'vue';

import { SidebarModal } from '@/shared/ui/sidebar-modal';
import { SlideOver } from '@/shared/ui/slide-over';

export default function registerGlobalComponents(app: App) {
  app.component('SidebarModal', SidebarModal);
  app.component('SlideOver', SlideOver);
}
