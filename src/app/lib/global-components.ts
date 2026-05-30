import type { App } from 'vue';

import { SidebarModal } from '@/shared/ui/sidebar-modal';

export default function registerGlobalComponents(app: App) {
  app.component('SidebarModal', SidebarModal);
}
