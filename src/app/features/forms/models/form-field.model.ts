export type FieldType = 'text' | 'email' | 'select' | 'checkbox' | 'number' | 'range' | 'url' | 'password';

export interface FormField {
  type: FieldType;
  label: string;
  name: string;
  options?: string[];
  value?: any;
  validators?: string[];
}

export interface FormState {
  fields: FormField[];
  undoStack: FormField[][];
  redoStack: FormField[][]; 
}