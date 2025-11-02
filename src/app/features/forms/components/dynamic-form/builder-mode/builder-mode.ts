import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';
import { FormField } from '../../../models/form-field.model';
import { Store } from '@ngrx/store';
import * as FormActions from '../../../store/form.actions';
import * as FormSelectors from '../../../store/form.selectors';

@Component({
  selector: 'app-builder-mode',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './builder-mode.html',
  styleUrls: ['./builder-mode.scss'],
})
export class BuilderMode implements OnInit {
  form!: FormGroup;

  formName = 'My Form';
  fields$!: Observable<FormField[]>;
  canUndo$!: Observable<boolean>;
  canRedo$!: Observable<boolean>;
  previewMode = false;

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
    this.store.dispatch(FormActions.updateAllFields({ fields: model }));
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

  getValues() {
    return this.form.get('fields')?.getRawValue();
  }
}
