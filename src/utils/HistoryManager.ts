/**
 * HistoryManager - Fixes browser back button.
 */
class HistoryManager {
  private states: Map<string, any> = new Map();
  private currentIndex = -1;
  push(key: string, state: any, url: string) {
    this.states.set(key, state);
    this.currentIndex++;
    window.history.pushState({ key, index: this.currentIndex }, "", url);
  }
  replace(key: string, state: any, url: string) {
    this.states.set(key, state);
    window.history.replaceState({ key, index: this.currentIndex }, "", url);
  }
  onPopState(handler: (state: any) => void) {
    window.addEventListener("popstate", (event) => {
      if (event.state && event.state.key && this.states.has(event.state.key)) {
        handler(this.states.get(event.state.key));
      }
    });
  }
  canGoBack(): boolean { return window.history.length > 1 && this.currentIndex > 0; }
}
export const historyManager = new HistoryManager();