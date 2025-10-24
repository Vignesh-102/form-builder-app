export interface UndoRedoState<T> {
  past: T[];
  present: T;
  future: T[];
}
