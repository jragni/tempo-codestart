
export interface Fields {
  component: string
  id: string,
  label: string,
  name: string
  required: boolean;
  sublabel?: string
  type: string,
}

export interface FormProps {
  action: (formData: FormData) => Promise<void>,
  fields: Fields[],
  submitText: string,
  title: string
}