import { createReducer, on, State } from '@ngrx/store';
import * as FormActions from './form.actions';
import { FormState } from '../models/form-field.model';

// ---------------------
// Initial State
// ---------------------
export const initialFormState: FormState = {
  fields: [],
  undoStack: [],
  redoStack: []
};

// ---------------------
// Reducer
// ---------------------
export const formReducer = createReducer(
  initialFormState,

  // Add field
  on(FormActions.addField, (state, { field }): FormState => ({
    ...state,
    undoStack: [...state.undoStack, state.fields],
    redoStack: [],
    fields: [...state.fields, field]
  })),

  // Update field
  on(FormActions.updateField, (state, { name, changes }): FormState => ({
    ...state,
    undoStack: [...state.undoStack, state.fields],
    redoStack: [],
    fields: state.fields.map(f =>
      f.name === name ? { ...f, ...changes } : f
    )
  })),

  // Remove field
  on(FormActions.removeField, (state, { name }): FormState => ({
    ...state,
    undoStack: [...state.undoStack, state.fields],
    redoStack: [],
    fields: state.fields.filter(f => f.name !== name)
  })),

  // Reset form
  on(FormActions.resetForm, (state): FormState => ({
    ...state,
    undoStack: [...state.undoStack, state.fields],
    redoStack: [],
    fields: []
  })),

  // Undo
  on(FormActions.undo, (state): FormState => {
    if (state.undoStack.length === 0) return state;
    const prev = state.undoStack[state.undoStack.length - 1];
    return {
      ...state,
      fields: prev,
      undoStack: state.undoStack.slice(0, -1),
      redoStack: [...state.redoStack, state.fields]
    };
  }),

  // Redo
  on(FormActions.redo, (state): FormState => {
    if (state.redoStack.length === 0) return state;
    const next = state.redoStack[state.redoStack.length - 1];
    return {
      ...state,
      fields: next,
      redoStack: state.redoStack.slice(0, -1),
      undoStack: [...state.undoStack, state.fields]
    };
  }),

  //reorder
  on(FormActions.reorderFields, (state, { fields }): FormState => ({
    ...state,
    undoStack: [...state.undoStack, state.fields],
    redoStack: [],
    fields: [...fields]
  })),

  //add fields
  on(FormActions.updateFieldOptions, (state, { index, options }) => {
    const updatedFields = [...state.fields];
    const field = { ...updatedFields[index], options };
    updatedFields[index] = field;
    return { ...state, fields: updatedFields };
  })
);