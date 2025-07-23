import { SidebarModal, SidebarContentWrapper } from '@/shared/ui/sidebar-modal';

import {
  CenterModal,
  CenterModalContentWrapper,
} from '@/shared/ui/center-modal';

export default function registerGlobalComponents(app) {
  app.component('SidebarModal', SidebarModal);
  app.component('SidebarContentWrapper', SidebarContentWrapper);

  app.component('CenterModal', CenterModal);
  app.component('CenterModalContentWrapper', CenterModalContentWrapper);
}
