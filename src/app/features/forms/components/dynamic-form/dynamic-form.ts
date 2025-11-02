import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, viewChild } from '@angular/core';
import {
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
import { BuilderMode } from "./builder-mode/builder-mode";
import { PreviewMode } from './preview-mode/preview-mode';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule, FormsModule, PreviewMode, BuilderMode],
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

  builderComponent = viewChild<BuilderMode>('builderComp');
  constructor(private fb: FormBuilder, private store: Store, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      formName: this.fb.control(''),
      fields: this.fb.array<FormGroup>([]),
    });

    this.fields$ = this.store.select(FormSelectors.selectFormFields);
    this.fields$.subscribe((fields) => {
        this.syncFormArray(fields);
        this.cd.detectChanges();
      });
  }

  // getter for convenience
  get fieldsFormArray(): FormArray<FormGroup> {
    return this.form.get('fields') as FormArray<FormGroup>;
  }

  /* ----------------- Toolbox / Drag & Drop ----------------- */

  onDrop(event: CdkDragDrop<FormField[]>): void {
    if (event.previousContainer === event.container) {
      const currentFields = structuredClone(event.container.data || []);
      moveItemInArray(currentFields, event.previousIndex, event.currentIndex);
      this.store.dispatch(FormActions.updateAllFields({ fields: currentFields }));
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
    const values = this.builderComponent()?.getValues();
    this.store.dispatch(FormActions.updateAllFields({ fields: values }));
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
    this.store.dispatch(FormActions.updateAllFields({ fields: model }));

    this.cd.detectChanges();
  }

  togglePreview(): void {
    if (!this.previewMode) {
      const values = this.builderComponent()?.getValues();
      this.store.dispatch(FormActions.updateAllFields({ fields: values }));
    }

    this.previewMode = !this.previewMode;
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

  private syncFormArray(fields: FormField[]): void {
  const fa = this.fieldsFormArray;

  // 🧹 Step 1: Remove missing fields
  for (let i = fa.length - 1; i >= 0; i--) {
    const fieldName = fa.at(i).get('name')?.value;
    if (!fields.some(f => f.name === fieldName)) {
      fa.removeAt(i, { emitEvent: false });
    }
  }

  // 🧩 Step 2: Add / move / patch existing fields
  fields.forEach((f, targetIndex) => {
    const currentIndex = fa.controls.findIndex(c => c.get('name')?.value === f.name);

    if (currentIndex === -1) {
      // ➕ New field → insert at correct index
      const newGroup = this.createFieldGroup(f);
      fa.insert(targetIndex, newGroup, { emitEvent: false });
    } else {
      // 🔀 Move existing if position changed
      if (currentIndex !== targetIndex) {
        const ctrl = fa.at(currentIndex);
        fa.removeAt(currentIndex, { emitEvent: false });
        fa.insert(targetIndex, ctrl, { emitEvent: false });
      }

      // 🧾 Patch only changed fields
      const group = fa.at(targetIndex);
      const newValue = {
        label: f.label ?? null,
        type: f.type ?? null,
        name: f.name ?? null,
        value: f.value ?? null,
      };
      group.patchValue(newValue, { emitEvent: false });

      // 🧩 Sync options array
      const optionsArray = group.get('options') as FormArray<FormControl<string | null>>;
      const opts = f.options ?? [];

      if (optionsArray.length !== opts.length) {
        // adjust length
        while (optionsArray.length < opts.length) {
          optionsArray.push(this.fb.control<string | null>(null));
        }
        while (optionsArray.length > opts.length) {
          optionsArray.removeAt(optionsArray.length - 1);
        }
      }
      optionsArray.patchValue(opts, { emitEvent: false });
    }
  });
}
private createFieldGroup(f: FormField): FormGroup {
  return this.fb.group({
    label: [f.label],
    type: [f.type],
    name: [f.name],
    options: this.fb.array(
      (f.options ?? []).map(opt => this.fb.control(opt))
    ),
    value: [f.value ?? null],
  });
}
}
