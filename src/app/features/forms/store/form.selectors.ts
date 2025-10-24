// form.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FormState } from '../models/form-field.model';

// Step 1: Feature Selector
export const selectFormState = createFeatureSelector<FormState>('form');


export const selectFormFields = createSelector(
  selectFormState,
  (state: FormState) => state.fields
);

export const selectFieldCount = createSelector(
  selectFormFields,
  (fields) => fields.length
);

export const selectCanUndo = createSelector(
  selectFormState,
  (state) => state.undoStack.length > 0
);

export const selectCanRedo = createSelector(
  selectFormState,
  (state) => state.redoStack.length > 0
);

