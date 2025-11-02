import { createAction, props } from '@ngrx/store';
import { FormField, FormState } from '../models/form-field.model';

// -------------------------
// Form field actions
// -------------------------

// Add a new field
export const addField = createAction(
  '[Form] Add Field',
  props<{ field: FormField }>()
);

// Update an existing field by name or id
export const updateField = createAction(
  '[Form] Update Field',
  props<{ name: string; changes: Partial<FormField> }>()
);

// Remove a field by name or id
export const removeField = createAction(
  '[Form] Remove Field',
  props<{ name: string }>()
);

// Reset the form (clear all fields)
export const resetForm = createAction(
  '[Form] Reset'
);


export const updateAllFields = createAction(
  '[Form Builder] Reorder Fields',
  props<{ fields: FormField[] }>()
);

// -------------------------
// Undo/Redo actions
// -------------------------

export const undo = createAction('[Form] Undo');
export const redo = createAction('[Form] Redo');


// adding options
export const updateFieldOptions = createAction(
  '[form] update field options',
  props<{ index: number; options: string[] }>()
)
