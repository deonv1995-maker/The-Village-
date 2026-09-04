export class SelectionSystem {
  constructor({ validIds = [] } = {}) {
    this.validIds = new Set(validIds);
    this.selectedIds = new Set();
    this.listeners = new Set();
  }

  setValidIds(validIds) {
    this.validIds = new Set(validIds);
    let changed = false;

    for (const id of this.selectedIds) {
      if (!this.validIds.has(id)) {
        this.selectedIds.delete(id);
        changed = true;
      }
    }

    if (changed) this.emit();
  }

  isSelected(id) {
    return this.selectedIds.has(id);
  }

  getSelectedIds() {
    return [...this.selectedIds];
  }

  selectOnly(id) {
    if (!this.validIds.has(id)) return false;
    if (this.selectedIds.size === 1 && this.selectedIds.has(id)) return false;

    this.selectedIds.clear();
    this.selectedIds.add(id);
    this.emit();
    return true;
  }

  toggle(id) {
    if (!this.validIds.has(id)) return false;

    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }

    this.emit();
    return true;
  }

  replace(ids) {
    const nextIds = new Set(ids.filter((id) => this.validIds.has(id)));
    const unchanged = nextIds.size === this.selectedIds.size
      && [...nextIds].every((id) => this.selectedIds.has(id));

    if (unchanged) return false;

    this.selectedIds = nextIds;
    this.emit();
    return true;
  }

  clear() {
    if (this.selectedIds.size === 0) return false;
    this.selectedIds.clear();
    this.emit();
    return true;
  }

  subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('SelectionSystem subscriber must be a function.');
    }

    this.listeners.add(listener);
    listener(this.getSelectedIds());
    return () => this.listeners.delete(listener);
  }

  emit() {
    const selectedIds = this.getSelectedIds();
    for (const listener of this.listeners) listener(selectedIds);
  }

  dispose() {
    this.listeners.clear();
    this.selectedIds.clear();
    this.validIds.clear();
  }
}
