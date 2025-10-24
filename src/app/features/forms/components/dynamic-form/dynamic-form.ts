import { CommonModule, JsonPipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormField } from '../../models/form-field.model';
import * as FormActions from '../../store/form.actions';
import * as FormSelectors from '../../store/form.selectors';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule, FormsModule, JsonPipe],
  templateUrl: './dynamic-form.html',
  styleUrls: ['./dynamic-form.scss'],
})
export class DynamicForm implements OnInit {
  form!: FormGroup;

  formName = 'My Form';
  fields$!: Observable<FormField[]>;
  canUndo$!: Observable<boolean>;
  canRedo$!: Observable<boolean>;
  previewMode = false;

  toolboxFields: FormField[] = [
    { type: 'text', label: 'Text Field', name: 'textField', validators: ['required'] },
    { type: 'email', label: 'Email Field', name: 'emailField', validators: ['required', 'email'] },
    { type: 'password', label: 'Password Field', name: 'passwordField', validators: ['required'] },
    { type: 'number', label: 'Number Field', name: 'numberField', validators: ['required'] },
    { type: 'range', label: 'Range Field', name: 'rangeField', validators: ['required'] },
    { type: 'url', label: 'URL Field', name: 'urlField', validators: ['required'] },
    {
      type: 'select',
      label: 'Select Field',
      name: 'selectField',
      options: ['Option 1', 'Option 2'],
      validators: [],
    },
  ];

  constructor(private fb: FormBuilder, private store: Store, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      formName: this.fb.control(''),
      // typed as array of FormGroup (each group's shape is dynamic)
      fields: this.fb.array<FormGroup>([]),
    });

    this.fields$ = this.store.select(FormSelectors.selectFormFields);
    this.canUndo$ = this.store.select(FormSelectors.selectCanUndo);
    this.canRedo$ = this.store.select(FormSelectors.selectCanRedo);

    // Rebuild local form array whenever store emits
    this.fields$.subscribe((fields) => {
      this.syncFormArray(fields);
      this.cd.detectChanges();
    });
  }

  // getter for convenience
  get fieldsFormArray(): FormArray<FormGroup> {
    return this.form.get('fields') as FormArray<FormGroup>;
  }

  /**
   * Build / rebuild the local FormArray from store model
   * Ensures every field group has an 'options' FormArray (typed FormControl<string | null>)
   */
  private syncFormArray(fields: FormField[]): void {
    const fa = this.fieldsFormArray;
    fa.clear();

    for (const f of fields) {
      const optionsArray = this.fb.array<FormControl<string | null>>(
        (f.options ?? []).map((opt) => this.fb.control<string | null>(opt ?? null))
      );

      const group = this.fb.group({
        label: this.fb.control<string | null>(f.label ?? null),
        type: this.fb.control<string | null>(f.type ?? null),
        name: this.fb.control<string | null>(f.name ?? null),
        options: optionsArray,
        value: this.fb.control<any>(f.value ?? null),
      });

      fa.push(group);
    }
  }

  /* ----------------- Toolbox / Drag & Drop ----------------- */

  onDrop(event: CdkDragDrop<FormField[]>): void {
    if (event.previousContainer === event.container) {
      const currentFields = structuredClone(event.container.data || []);
      moveItemInArray(currentFields, event.previousIndex, event.currentIndex);
      this.store.dispatch(FormActions.reorderFields({ fields: currentFields }));
    } else {
      const newField = { ...(event.previousContainer.data[event.previousIndex] as FormField) };
      newField.name = `${newField.name}_${Date.now()}`;
      this.store.dispatch(FormActions.addField({ field: newField }));
    }
  }

  /**
   * Add a new field (from toolbox) into the local form AND sync to store.
   * Accepts FormField because toolbox items are FormField objects.
   */
  addFieldFromToolbox(item: FormField): void {
    const optionsArray = this.fb.array<FormControl<string | null>>(
      item.type === 'select' ? (item.options ?? []).map((o) => this.fb.control<string | null>(o ?? null)) : []
    );

    const group = this.fb.group({
      label: this.fb.control<string | null>(item.label ?? null),
      type: this.fb.control<string | null>(item.type ?? null),
      name: this.fb.control<string | null>(`${item.name ?? 'field'}_${Date.now()}`),
      options: optionsArray,
      value: this.fb.control<any>(item.value ?? null),
    });

    this.fieldsFormArray.push(group);

    // update store with new list (so undo/redo & persistence work)
    const model = this.formArrayToFieldModel();
    this.store.dispatch(FormActions.reorderFields({ fields: model }));

    this.cd.detectChanges();
  }

  /* ----------------- Options helpers (typed) ----------------- */

  /**
   * Safely returns the typed options FormArray for a given field index.
   * Always returns a FormArray<FormControl<string | null>> (never unknown).
   */
  getOptionsFormArray(index: number): FormArray<FormControl<string | null>> {
    const group = this.fieldsFormArray.at(index) as FormGroup | undefined;
    if (!group) {
      // explicit typed empty array to avoid 'unknown' inference
      return this.fb.array<FormControl<string | null>>([]);
    }

    const control = group.get('options');
    if (!control) {
      const newArr = this.fb.array<FormControl<string | null>>([]);
      group.addControl('options', newArr);
      return newArr;
    }

    // cast safe because we always created it with that type in syncFormArray / addFieldFromToolbox
    return control as FormArray<FormControl<string | null>>;
  }

  /**
   * Add new option in local form and dispatch normalized string[] to store.
   */
  addOption(index: number): void {
    const options = this.getOptionsFormArray(index);
    const newOption = `Option ${options.length + 1}`;
    options.push(this.fb.control<string | null>(newOption));

    // normalize and dispatch
    const normalized = options.value.map((v) => v ?? '').filter((v) => v !== '');
    this.store.dispatch(FormActions.updateFieldOptions({ index, options: normalized }));

    this.cd.detectChanges();
  }

  /**
   * Remove option at index and update store.
   */
  removeOption(fieldIndex: number, optionIndex: number): void {
    const options = this.getOptionsFormArray(fieldIndex);
    if (options.length > optionIndex) {
      options.removeAt(optionIndex);

      const normalized = options.value.map((v) => v ?? '').filter((v) => v !== '');
      this.store.dispatch(FormActions.updateFieldOptions({ index: fieldIndex, options: normalized }));

      this.cd.detectChanges();
    }
  }

  getOptionIndices(index: number): number[] {
    return this.getOptionsFormArray(index).controls.map((_, i) => i);
  }

  /* ----------------- Other actions ----------------- */

  deleteField(index: number): void {
    this.fieldsFormArray.removeAt(index);
    const model = this.formArrayToFieldModel();
    this.store.dispatch(FormActions.reorderFields({ fields: model }));
  }

  clearCanvas(): void {
    this.store.dispatch(FormActions.resetForm());
  }

  undo(): void {
    this.store.dispatch(FormActions.undo());
  }

  redo(): void {
    this.store.dispatch(FormActions.redo());
  }

  togglePreview(): void {
    this.previewMode = !this.previewMode;
  }

  onCreate(): void {
    console.log('Form value:', this.form.value);
  }

  /* ----------------- Utility ----------------- */

  private formArrayToFieldModel(): FormField[] {
    return this.fieldsFormArray.controls.map((grp) => {
      const g = grp as FormGroup;
      const label = (g.get('label')?.value ?? '') as string;
      const type = (g.get('type')?.value ?? '') as string;
      const name = (g.get('name')?.value ?? '') as string;
      const optionsRaw = (g.get('options')?.value ?? []) as (string | null)[];
      const options = optionsRaw.map((o) => o ?? '').filter((o) => o !== '');
      const value = g.get('value')?.value ?? null;
      return { label, type, name, options, value } as FormField;
    });
  }
}
