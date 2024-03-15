import SidebarModal from '@/core/ui/components/shared/sidebar-modal/SidebarModal.vue';
import SidebarContentWrapper from '@/core/ui/components/shared/sidebar-modal/SidebarContentWrapper.vue';

import CenterModal from '@/core/ui/components/shared/center-modal/CenterModal.vue';
import CenterModalContentWrapper from '@/core/ui/components/shared/center-modal/CenterModalContentWrapper.vue';

export default function registerGlobalComponents(app) {
  app.component('SidebarModal', SidebarModal);
  app.component('SidebarContentWrapper', SidebarContentWrapper);

  app.component('CenterModal', CenterModal);
  app.component('CenterModalContentWrapper', CenterModalContentWrapper);
}
