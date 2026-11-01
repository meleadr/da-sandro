import type { FieldTree, ReadonlyFieldTree, TreeValidationResult } from '@angular/forms/signals';

/** The message to show under a field, once the visitor has left it or tried to submit. */
export function visibleError<T>(field: FieldTree<T>): string | undefined {
  const state = field();
  return state.touched() ? state.errors()[0]?.message : undefined;
}

/** Moves the focus to the first invalid field after a refused submission. */
export function focusFirstError<T>(form: FieldTree<T>): void {
  form().errorSummary()[0]?.fieldTree().focusBoundControl();
}

/**
 * Maps the errors of a shared parser onto form fields. The parsers also run on the server, so
 * they cannot depend on Angular: this keeps them the single source of the validation rules.
 */
export function toFieldErrors<T extends object>(
  errors: Partial<Record<keyof T, string>>,
  fields: ReadonlyFieldTree<T>,
): TreeValidationResult {
  const tree = fields as unknown as Record<string, ReadonlyFieldTree<unknown>>;

  return Object.entries(errors).map(([field, message]) => ({
    kind: 'invalid',
    message: message as string,
    fieldTree: tree[field],
  }));
}

export async function postForm(url: string, body: unknown): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return response.ok;
  } catch {
    return false;
  }
}
