import type { Ref } from 'vue';

interface FormActions {
  submit: () => void;
  reset: () => void;
  setValues: (values: Record<string, unknown>) => void;
}

export function useFormActions<T>(formRef: Readonly<Ref<T | null>>) {
  const getForm = () => formRef.value as FormActions | null;

  return {
    submitForm: () => getForm()?.submit(),
    resetForm: () => getForm()?.reset(),
    setFormValues: (values: Record<string, unknown>) =>
      getForm()?.setValues(values),
  };
}
