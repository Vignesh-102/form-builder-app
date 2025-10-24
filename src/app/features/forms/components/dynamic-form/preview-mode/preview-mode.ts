import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormField } from '../../../models/form-field.model'; // adjust path if needed
import * as FormSelectors from '../../../store/form.selectors';


@Component({
  selector: 'app-preview-mode',
  imports: [ReactiveFormsModule, DragDropModule],
  templateUrl: './preview-mode.html',
  styleUrl: './preview-mode.scss'
})
export class PreviewMode implements OnInit {
  form!: FormGroup;
  
    formName = 'My Form';
    fields$!: Observable<FormField[]>;

    previewMode = false;
    constructor(private fb: FormBuilder, private store: Store, private cd: ChangeDetectorRef) {}
  
    ngOnInit(): void {
      this.form = this.fb.group({
        formName: this.fb.control(''),
        // typed as array of FormGroup (each group's shape is dynamic)
        fields: this.fb.array<FormGroup>([]),
      });
  
      this.fields$ = this.store.select(FormSelectors.selectFormFields);
  
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
}
