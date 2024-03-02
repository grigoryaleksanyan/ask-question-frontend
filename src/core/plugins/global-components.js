import Vue from 'vue';

import SidebarModal from '@/core/ui/components/shared/sidebar-modal/SidebarModal.vue';
import SidebarContentWrapper from '@/core/ui/components/shared/sidebar-modal/SidebarContentWrapper.vue';

import CenterModal from '@/core/ui/components/shared/center-modal/CenterModal.vue';
import CenterModalContentWrapper from '@/core/ui/components/shared/center-modal/CenterModalContentWrapper.vue';

Vue.component('SidebarModal', SidebarModal);
Vue.component('SidebarContentWrapper', SidebarContentWrapper);

Vue.component('CenterModal', CenterModal);
Vue.component('CenterModalContentWrapper', CenterModalContentWrapper);
