import { describe, it, expect, vi } from 'vitest';

import { ref } from 'vue';

import { useFormActions } from '@/shared/lib/use-form-actions';

describe('useFormActions', () => {
  it('calls submit on the form element', () => {
    const mockSubmit = vi.fn();
    const formRef = ref({ submit: mockSubmit, reset: vi.fn(), setValues: vi.fn() });

    const { submitForm } = useFormActions(formRef as any);
    submitForm();

    expect(mockSubmit).toHaveBeenCalledOnce();
  });

  it('calls reset on the form element', () => {
    const mockReset = vi.fn();
    const formRef = ref({ submit: vi.fn(), reset: mockReset, setValues: vi.fn() });

    const { resetForm } = useFormActions(formRef as any);
    resetForm();

    expect(mockReset).toHaveBeenCalledOnce();
  });

  it('calls setValues on the form element', () => {
    const mockSetValues = vi.fn();
    const formRef = ref({ submit: vi.fn(), reset: vi.fn(), setValues: mockSetValues });

    const { setFormValues } = useFormActions(formRef as any);
    setFormValues({ name: 'test' });

    expect(mockSetValues).toHaveBeenCalledWith({ name: 'test' });
  });

  it('does nothing when formRef is null', () => {
    const formRef = ref(null);

    const { submitForm, resetForm, setFormValues } = useFormActions(formRef as any);

    expect(() => {
      submitForm();
      resetForm();
      setFormValues({});
    }).not.toThrow();
  });
});
