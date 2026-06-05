import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import AreaCard from '@/entities/area/ui/AreaCard.vue';

vi.mock('@/shared/lib/use-api-call', () => ({
  useApiCall: () => ({
    execute: vi.fn().mockResolvedValue({ id: '1', title: 'Updated Area' }),
    isLoading: { value: false },
    error: { value: null },
    data: { value: null },
  }),
}));

vi.mock('@/entities/area/api/areas-repository', () => ({
  Update: vi.fn(),
}));

describe('AreaCard', () => {
  const area = { id: '1', title: 'Test Area' };

  it('меняет иконку удаления на сохранение при редактировании', async () => {
    const wrapper = mount(AreaCard, { props: { area } });
    expect(wrapper.find('.pi-trash').exists()).toBe(true);
    expect(wrapper.find('.pi-save').exists()).toBe(false);

    await wrapper.find('.pi-pencil').trigger('click');
    await nextTick();

    expect(wrapper.find('.pi-save').exists()).toBe(true);
    expect(wrapper.find('.pi-trash').exists()).toBe(false);
  });

  it('сохраняет при клике на pi-save', async () => {
    const wrapper = mount(AreaCard, { props: { area } });
    await wrapper.find('.pi-pencil').trigger('click');
    await nextTick();
    await wrapper.find('.area-card__input').setValue('Updated Area');
    await wrapper.find('.pi-save').trigger('click');
    await nextTick();

    expect(wrapper.emitted('updated')).toHaveLength(1);
    expect(wrapper.emitted('updated')![0]).toEqual([{ id: '1', title: 'Updated Area' }]);
  });

  it('отменяет редактирование при клике на крестик Inplace', async () => {
    const wrapper = mount(AreaCard, { props: { area } });
    await wrapper.find('.pi-pencil').trigger('click');
    await nextTick();
    await wrapper.find('.area-card__input').setValue('New Title');
    const closeBtn = wrapper.find('.pi-times');
    expect(closeBtn.exists()).toBe(true);
    await closeBtn.trigger('click');
    await nextTick();

    expect(wrapper.find('.pi-trash').exists()).toBe(true);
    expect(wrapper.find('.area-card__title').text()).toBe('Test Area');
  });

  it('сохраняет при нажатии Enter', async () => {
    const wrapper = mount(AreaCard, { props: { area } });
    await wrapper.find('.pi-pencil').trigger('click');
    await nextTick();
    await wrapper.find('.area-card__input').setValue('Updated Area');
    await wrapper.find('.area-card__input').trigger('keydown.enter');
    await nextTick();

    expect(wrapper.emitted('updated')).toHaveLength(1);
    expect(wrapper.emitted('updated')![0]).toEqual([{ id: '1', title: 'Updated Area' }]);
  });

  it('отменяет при нажатии Escape', async () => {
    const wrapper = mount(AreaCard, { props: { area } });
    await wrapper.find('.pi-pencil').trigger('click');
    await nextTick();
    await wrapper.find('.area-card__input').setValue('New Title');
    await wrapper.find('.area-card__input').trigger('keydown.escape');
    await nextTick();

    expect(wrapper.find('.pi-trash').exists()).toBe(true);
    expect(wrapper.find('.area-card__title').text()).toBe('Test Area');
  });

  it('отменяет при пустом поле или без изменений', async () => {
    const wrapper = mount(AreaCard, { props: { area } });
    await wrapper.find('.pi-pencil').trigger('click');
    await nextTick();
    // Empty field
    await wrapper.find('.area-card__input').setValue('');
    await wrapper.find('.pi-save').trigger('click');
    await nextTick();

    expect(wrapper.emitted('updated')).toBeUndefined();
    expect(wrapper.find('.pi-trash').exists()).toBe(true);
  });
});
