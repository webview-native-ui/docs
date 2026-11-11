import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodePanel } from './code-panel';

describe('CodePanel', () => {
  let fixture: ComponentFixture<CodePanel>;
  let component: CodePanel;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodePanel],
    }).compileComponents();

    fixture = TestBed.createComponent(CodePanel);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('codes', [
      { file: 'a.ts', lines: ['one', 'two', 'three', 'four', 'five'] },
      { file: 'b.ts', lines: ['alpha', 'beta'] },
    ]);
  });

  it('isHighlighted uses the legacy exclusive range', () => {
    fixture.componentRef.setInput('activeLines', { 'a.ts': [2, 5] });

    expect(component.isHighlighted('a.ts', 2)).toBe(false);
    expect(component.isHighlighted('a.ts', 3)).toBe(true);
    expect(component.isHighlighted('a.ts', 4)).toBe(true);
    expect(component.isHighlighted('a.ts', 5)).toBe(false);

    expect(component.isDimmed('a.ts', 2)).toBe(true);
    expect(component.isDimmed('a.ts', 3)).toBe(false);
    expect(component.isDimmed('a.ts', 4)).toBe(false);
    expect(component.isDimmed('a.ts', 5)).toBe(true);
  });

  it('applies no highlight or dimming when no range is present', () => {
    fixture.componentRef.setInput('activeLines', {});
    expect(component.isHighlighted('a.ts', 1)).toBe(false);
    expect(component.isHighlighted('a.ts', 99)).toBe(false);
    expect(component.isDimmed('a.ts', 1)).toBe(false);
    expect(component.isDimmed('a.ts', 99)).toBe(false);

    fixture.componentRef.setInput('activeLines', { 'a.ts': [] });
    expect(component.isHighlighted('a.ts', 1)).toBe(false);
    expect(component.isHighlighted('a.ts', 3)).toBe(false);
    expect(component.isDimmed('a.ts', 1)).toBe(false);
    expect(component.isDimmed('a.ts', 3)).toBe(false);
  });

  it('applies no highlight or dimming for an empty exclusive range', () => {
    fixture.componentRef.setInput('activeLines', { 'a.ts': [1, 1] });

    expect(component.isHighlighted('a.ts', 1)).toBe(false);
    expect(component.isHighlighted('a.ts', 2)).toBe(false);
    expect(component.isDimmed('a.ts', 1)).toBe(false);
    expect(component.isDimmed('a.ts', 2)).toBe(false);
  });

  it('selects the first available mapped file when the active lines input changes', () => {
    fixture.componentRef.setInput('activeLines', {
      'missing.ts': [1, 3],
      'b.ts': [1, 2],
      'a.ts': [1, 4],
    });

    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[role="tab"][aria-selected="true"]')?.textContent?.trim()).toBe(
      'b.ts',
    );
    expect(Array.from(element.querySelectorAll('.code-row'), (row) => row.textContent)).toEqual([
      'alpha',
      'beta',
    ]);
  });
  it('connects tabs to panels and keeps only the selected tab in the tab sequence', () => {
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const tabs = Array.from(element.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    expect(tabs.map((tab) => tab.tabIndex)).toEqual([0, -1]);
    for (const tab of tabs) {
      const panel = element.ownerDocument.getElementById(tab.getAttribute('aria-controls')!);
      expect(panel?.getAttribute('role')).toBe('tabpanel');
      expect(panel?.getAttribute('aria-labelledby')).toBe(tab.id);
      expect(panel?.hidden).toBe(tab.getAttribute('aria-selected') !== 'true');
    }
  });

  it('selects and focuses tabs with arrows, wrapping, Home and End', () => {
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const tabs = Array.from(element.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    tabs[0].focus();
    for (const [key, expected] of [
      ['ArrowLeft', 1],
      ['ArrowRight', 0],
      ['End', 1],
      ['Home', 0],
    ] as const) {
      const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
      element.ownerDocument.activeElement?.dispatchEvent(event);
      fixture.detectChanges();
      expect(event.defaultPrevented).toBe(true);
      expect(element.ownerDocument.activeElement).toBe(tabs[expected]);
      expect(tabs[expected].getAttribute('aria-selected')).toBe('true');
      expect(tabs.map((tab) => tab.tabIndex)).toEqual(expected ? [-1, 0] : [0, -1]);
      expect(
        element.querySelector('[role="tabpanel"]:not([hidden])')?.getAttribute('aria-labelledby'),
      ).toBe(tabs[expected].id);
    }
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    tabs[0].dispatchEvent(tabEvent);
    expect(tabEvent.defaultPrevented).toBe(false);
  });
});
